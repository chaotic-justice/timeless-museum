import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm, type SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { z } from 'zod'
import Layout from '../components/layout/Layout'
import FilesDropper from '../components/userInterfaces/filesDropper'
import ImagePreviews from '../components/userInterfaces/imagePreviews'
import { IMAGE_MAX_SIZE, RESIZING_THRESHOLD } from '../library/constants'
import { MutationCreateArtworkArgs } from '../library/gql/graphql'
import { createArtwork } from '../library/hooks'

type ResizingObj = {
  filePath: string
  resize: boolean
}

const schema = z.object({
  title: z.string().nonempty('Title is required.').max(50),
  category: z.string().nonempty('Category is required'),
  description: z.optional(z.string()),
  // uploaded: z
  //   .boolean()
  //   .default(false)
  //   .refine(value => value === true, {
  //     message: 'Upload not successful',
  //   }),
  images: z
    .array(
      z.object({
        image: z
          .custom<FileList>()
          .transform(file => file.length > 0 && file.item(0))
          .refine(file => !file || (!!file && file.size <= IMAGE_MAX_SIZE), {
            message: 'Maximum 5MB',
          })
          .refine(file => !file || (!!file && file.type?.startsWith('image')), {
            message: 'Only images are allowed to be sent.',
          }),
      })
    )
    .nonempty('Images are required'),
})
export type FormSchema = z.infer<typeof schema>
export type ImageObj = z.infer<typeof schema>['images'][number]

const Uploaded = () => {
  const router = useRouter()
  const { pathname } = router
  const { data: sessionData } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(`/api/auth/signin?callbackUrl=/${pathname}`)
    },
  })

  useEffect(() => {
    if (sessionData && sessionData.user.role !== 'ADMIN') {
      router.push('/')
    }
  }, [router, sessionData])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormSchema>({
    defaultValues: { images: [] },
    mode: 'onChange',
    resolver: zodResolver(schema),
  })
  const images = watch('images')
  const { fields, remove, replace } = useFieldArray({
    name: 'images',
    control,
  })
  const { mutate } = useMutation({
    mutationFn: async (args: MutationCreateArtworkArgs) => createArtwork(args),
    onSuccess: () => {
      router.push('/')
    },
  })

  useEffect(() => {
    // Clean up files when component unmounts
    return () => {
      remove()
    }
  }, [remove])

  const resizeImages = async (resizing: ResizingObj[]) => {
    const resizingPromises = resizing.map(async item => {
      if (item.resize) {
        const resizingPromise = await fetch(`/api/imageResize?filePath=${item.filePath}`)
        return resizingPromise.ok
      }
      return true
    })

    toast.promise(Promise.all(resizingPromises), {
      loading: 'Resizing...',
      success: () => {
        return 'All images successfully resized!🎉'
      },
      error: () => {
        return `Resizing failed for some images 😥 Please try again`
      },
    })
  }

  const onSubmit: SubmitHandler<FormSchema> = async data => {
    const { title, category, description, images: formImages } = data

    console.log('formImages', formImages)
    const dirName = 'local'
    const resizing = new Array(images.length).fill(false).map(v => ({ filePath: '', resize: v }))
    const promises = images
      .filter(v => Boolean(v))
      .map(async (item, i) => {
        const { image } = item
        if (!image) {
          return null
        }
        const filename = `${fields[i].id}.${image.type.split('/')[1]}`
        const filePath = `${dirName}/${filename}`
        resizing[i].filePath = filePath
        resizing[i].resize = image.size > RESIZING_THRESHOLD
        const presignedPromise = await fetch(`/api/presign?filePath=${filePath}`)
        const presignedRes = await presignedPromise.json()
        if (!presignedRes.authorized) {
          toast.error('Not authorized to perform this action')
          return null
        }

        return fetch(presignedRes.url, {
          method: 'PUT',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        })
          .then(() => {
            return true
          })
          .catch(() => {
            return false
          })
      })

    toast.promise(Promise.all(promises), {
      loading: 'Uploading...',
      success: () => {
        // setValue('uploaded', true)
        resizeImages(resizing)
        return 'All images successfully uploaded to s3 bucket!🎉'
      },
      error: () => {
        // setValue('uploaded', false)
        return `Upload failed for some images 😥 Please try again`
      },
    })

    // const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`
    // mutate({ title, category, description, imageUrls: [imageUrl] })
  }

  if (sessionData?.user.role !== 'ADMIN') return undefined

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-12">
        <Toaster />
        <h1 className="text-3xl text-center font-medium my-5">Add a new image</h1>
        <form className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-gray-700">Title</span>
            <input
              {...register('title')}
              placeholder="Title"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </label>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <input
              placeholder="Description"
              {...register('description')}
              name="description"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </label>
          <label className="block">
            <span className="text-gray-700">Category</span>
            <input
              placeholder="Name"
              {...register('category')}
              name="category"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </label>
          <label className="block">
            <Controller
              name="images"
              render={({ field: { ...rest } }) => (
                <FilesDropper files={images} replace={replace} fields={fields} {...rest} />
              )}
              control={control}
            />
            {errors.images && <p className="text-red-500">{errors.images.message}</p>}
          </label>
          <ImagePreviews files={images} remove={remove} />
          <button
            disabled={!isValid || !isDirty}
            type="submit"
            className={`my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 ${
              !isValid && 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span>submit</span>
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Uploaded

// this post unblocked me on providing a ref to the image input: https://github.com/orgs/react-hook-form/discussions/10091
