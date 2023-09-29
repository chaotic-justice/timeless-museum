import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { z } from 'zod'
import Layout from '../components/layout/Layout'
import { MutationCreateArtworkArgs } from '../library/gql/graphql'
import { createArtwork } from '../library/hooks'

const ImageSizeLimit = 1048576 * 5 // maximum image size allowed (before resizing) - 5MB

const schema = z.object({
  title: z.string().nonempty('Title is required.').max(50),
  category: z.string().nonempty('Category is required'),
  description: z.optional(z.string()),
  filename: z.optional(z.string()),
  uploaded: z
    .boolean()
    .default(false)
    .refine(value => value === true, {
      message: 'Upload not successful',
    }),
  images: z.custom<File>(v => v instanceof File, {
    message: 'Image is required',
  }),
})
type Schema = z.infer<typeof schema>

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
    formState: { errors, isValid },
  } = useForm<Schema>({
    mode: 'all',
    resolver: zodResolver(schema),
  })

  const { mutate } = useMutation({
    mutationFn: async (args: MutationCreateArtworkArgs) => createArtwork(args),
    onSuccess: () => {
      router.push('/')
    },
  })

  /* 
  event listener for
    1. uploading image locally
    2. creating a presigned url
    3. making a PUT request to the presigned url
  */
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    if (!e.target.files || e.target.files.length <= 0) return
    const file = e.target.files[0]
    const timestamp = Date.now().toString()
    onChange(file)

    // append timestamp to filename string & to uniquely identify the image key
    let filename = encodeURIComponent(file.name)
    const extIdx = filename.lastIndexOf('.')
    const fileExtension = filename.substring(extIdx + 1).toLowerCase()
    filename = `${filename.substring(0, extIdx)}_${timestamp}.${fileExtension}`
    setValue('filename', filename)

    const res = await fetch(`/api/presign?filename=${filename}`)
    const presignedRes = await res.json()
    if (!presignedRes.authorized) {
      toast.error('not authorized to perform this action')
      return
    }

    const formData = new FormData()
    if (file.size > ImageSizeLimit) {
      toast.error(`size limit exceeded: ${file.size}`)
      return
    }
    Object.entries({ file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
    })

    toast.promise(
      fetch(presignedRes.url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      }),
      {
        loading: 'Uploading...',
        success: () => {
          setValue('uploaded', true)
          return 'Image successfully uploaded to s3 bucket!🎉'
        },
        error: () => {
          setValue('uploaded', false)
          return `Upload failed 😥 Please try again`
        },
      }
    )
  }

  const onSubmit: SubmitHandler<Schema> = async data => {
    const { title, category, description, filename } = data
    toast.promise(fetch(`/api/imageResize?filename=${filename}`), {
      loading: 'Resizing...',
      success: 'Image successfully resized.',
      error: 'Image resizing failed.',
    })
    const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`
    mutate({ title, category, description, imageUrls: [imageUrl] })
  }

  if (sessionData?.user.role !== 'ADMIN') return undefined

  return (
    <Layout>
      <div className="container mx-auto max-w-md py-12">
        <Toaster />
        <h1 className="text-3xl font-medium my-5">Add a new image</h1>
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
            <span className="text-gray-700">Upload a .png or .jpg image (max 1MB).</span>
            <Controller
              name="images"
              control={control}
              render={({ field: { ref, onBlur, onChange } }) => (
                <input
                  onBlur={onBlur}
                  onChange={e => uploadPhoto(e, onChange)}
                  ref={ref}
                  type="file"
                  accept="image/*"
                />
              )}
            />
            {errors.images && <p className="text-red-500">{errors.images.message}</p>}
          </label>
          <button
            disabled={!isValid}
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

// TODO: show image preview
export default Uploaded

// this post unblocked me on providing a ref to the image input: https://github.com/orgs/react-hook-form/discussions/10091
