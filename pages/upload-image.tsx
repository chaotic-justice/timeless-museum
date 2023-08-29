import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import { MutationCreateArtworkArgs } from '../library/gql/graphql'
import { createArtwork } from '../library/hooks'
import { useRouter } from 'next/router'

type FormValues = {
  title: string
  category: string
  description: string
  filename: string
  images: FileList
}

const ImageSizeLimit = 1048576 * 5

const Uploaded = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>()

  const { mutate } = useMutation({
    mutationFn: async (args: MutationCreateArtworkArgs) => createArtwork(args),
    onSuccess: () => {
      // router.push('/')
      console.log('first....')
    },
  })

  // Upload photo function
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return
    const file = e.target.files[0]
    const timestamp = Date.now().toString()
    let filename = encodeURIComponent(file.name)
    const extIdx = filename.lastIndexOf('.')
    const fileExtension = filename.substring(extIdx + 1).toLowerCase()
    console.log('fileExtension', fileExtension)
    filename = `${filename.substring(0, extIdx)}_${timestamp}.${fileExtension}`
    setValue('filename', filename)
    const res = await fetch(`/api/presign?filename=${filename}`)
    const presignedUrl = await res.json()
    const formData = new FormData()

    if (file.size > ImageSizeLimit) {
      console.log('size limit exceeded', file.size)
      return
    }
    Object.entries({ file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
    })

    toast.promise(
      fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      }),
      {
        loading: 'Uploading...',
        success: 'Image successfully uploaded!🎉',
        error: `Upload failed 😥 Please try again`,
      }
    )
  }

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const { title, category, description, filename } = data
    const resizing = await fetch(`/api/imageResize?filename=${filename}`)
    const res = await resizing.json()
    console.log('resizing', res)
    const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`
    mutate({ title, category, description, imageUrls: [imageUrl] })
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-md py-12">
        <Toaster />
        <h1 className="text-3xl font-medium my-5">Add a new image</h1>
        <form className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-gray-700">Title</span>
            <input
              placeholder="Title"
              {...register('title', { required: true })}
              name="title"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <input
              placeholder="Description"
              {...register('description', { required: false })}
              name="description"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Category</span>
            <input
              placeholder="Name"
              {...register('category', { required: true })}
              name="category"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Upload a .png or .jpg image (max 1MB).</span>
            <input
              {...register('images', { required: true })}
              onChange={uploadPhoto}
              type="file"
              accept="image/*"
              name="images"
            />
          </label>
          <button
            disabled={false}
            type="submit"
            className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
          >
            <span>add image</span>
          </button>
        </form>
        <h3> {errors.description && errors.description.message}</h3>
      </div>
    </Layout>
  )
}

export default Uploaded
