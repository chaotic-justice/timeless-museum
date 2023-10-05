import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, type SubmitHandler, useFieldArray } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { any, z } from 'zod'
import Layout from '../components/layout/Layout'
import FilesDropper from '../components/userInterfaces/filesDropper'
import { MutationCreateArtworkArgs } from '../library/gql/graphql'
import { createArtwork } from '../library/hooks'
import ImagePreviews from '../components/userInterfaces/imagePreviews'
import { generateFileName } from '../library/utils'

const schema = z.object({
  title: z.string().nonempty('Title is required.').max(50),
  category: z.string().nonempty('Category is required'),
  description: z.optional(z.string()),
  filenames: z.optional(z.string()),
  uploaded: z
    .boolean()
    .default(false)
    .refine(value => value === true, {
      message: 'Upload not successful',
    }),
  images: z
    .array(
      // z.custom<File>(v => v instanceof File, {
      //   message: 'Invalid file type',
      // })
      z.any()
    )
    .nonempty('Images are required'),
})
export type FormSchema = z.infer<typeof schema>
// type Image = z.infer<typeof schema>['images'][number]

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
    formState: { errors, isValid, isDirty, defaultValues },
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

  /* 
  event listener for
    1. uploading image locally
    2. creating a presigned url
    3. making a PUT request to the presigned url
  */
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (!e.target.files || e.target.files.length <= 0) return
    onChange(e.target.files)

    // const res = await fetch(`/api/presign?filename=${filename}`)
    // const presignedRes = await res.json()
    // if (!presignedRes.authorized) {
    //   toast.error('not authorized to perform this action')
    //   return
    // }

    // const formData = new FormData()
    // if (file.size > IMAGE_MAX_SIZE) {
    //   toast.error(`size limit exceeded: ${file.size}`)
    //   return
    // }
    // Object.entries({ file }).forEach(([key, value]) => {
    //   // @ts-ignore
    //   formData.append(key, value)
    // })

    // toast.promise(
    //   fetch(presignedRes.url, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': file.type,
    //     },
    //     body: file,
    //   }),
    //   {
    //     loading: 'Uploading...',
    //     success: () => {
    //       setValue('uploaded', true)
    //       return 'Image successfully uploaded to s3 bucket!🎉'
    //     },
    //     error: () => {
    //       setValue('uploaded', false)
    //       return `Upload failed 😥 Please try again`
    //     },
    //   }
    // )
  }

  const debugging = () => {
    console.log('fields', fields)
    fields.forEach(({ path: filePath, id: fileId }) => {
      const extIdx = filePath.lastIndexOf('.')
      const extension = filePath.substring(extIdx + 1).toLowerCase()
      const filename = generateFileName(extension, fileId)
      console.log('filename', filename)
    })
  }

  const onSubmit: SubmitHandler<FormSchema> = async data => {
    const { title, category, description, images, filenames } = data
    // toast.promise(fetch(`/api/imageResize?filename=${filename}`), {
    //   loading: 'Resizing...',
    //   success: 'Image successfully resized.',
    //   error: 'Image resizing failed.',
    // })
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
          <button onClick={debugging}>debugging</button>
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
