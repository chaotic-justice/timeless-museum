import { type SubmitHandler, useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"

type FormValues = {
  title: string
  image: FileList
}

const Uploaded = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  // Upload photo function
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return
    const file = e.target.files[0]
    const filename = encodeURIComponent(file.name)
    const res = await fetch(`/api/upload-image?file=${filename}`)
    const data = await res.json()
    console.log("data", data)
    const formData = new FormData()

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value)
    })

    toast.promise(
      fetch(data.url, {
        method: "POST",
        body: formData,
      }),
      {
        loading: "Uploading...",
        success: "Image successfully uploaded!🎉",
        error: `Upload failed 😥 Please try again`,
      }
    )
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("first")
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <form className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            {...register("title", { required: true })}
            name="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Upload a .png or .jpg image (max 1MB).</span>
          <input
            {...register("image", { required: true })}
            onChange={uploadPhoto}
            type="file"
            accept="image/*"
            name="image"
          />
        </label>
      </form>
    </div>
  )
}

export default Uploaded
