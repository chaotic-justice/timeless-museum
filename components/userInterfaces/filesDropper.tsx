import { Button } from 'antd'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { GoTrash } from 'react-icons/go'
import { ImageSizeLimit, MAX_FILES_CAP } from '../../library/constants'

const FilesDropper: React.FC = () => {
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps, acceptedFiles, fileRejections, isFocused, isDragActive } = useDropzone({
    maxFiles: MAX_FILES_CAP,
    maxSize: ImageSizeLimit,
    accept: {
      'image/*': [],
    },
    disabled: files.length === MAX_FILES_CAP,
  })

  useEffect(() => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles].slice(0, MAX_FILES_CAP))
  }, [acceptedFiles])

  useEffect(() => {
    // Clean up files when component unmounts
    return () => {
      setFiles([])
    }
  }, [])

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file))
  }

  const rejectionErrors = useMemo(() => {
    return fileRejections.map(({ file, errors }) => {
      const errorMessage = errors[0].message
      const imageName = file.name
      return `${errorMessage} - ${imageName}`
    })
  }, [fileRejections])

  rejectionErrors.forEach(errorMessage => {
    toast.error(errorMessage, { duration: 2500 })
  })

  const filePreviews = files.map((file, idx) => (
    <div key={file.name + '_' + idx} className="relative w-32 h-32 m-2">
      <Image
        src={URL.createObjectURL(file)}
        alt={file.name}
        width={240}
        height={300}
        className="object-cover w-full h-full rounded-lg"
      />
      <Button
        danger
        type="primary"
        icon={<GoTrash />}
        onClick={() => removeFile(file)}
        className="absolute top-1 right-1 text-white h-6"
      />
    </div>
  ))

  return (
    <div className="text-center">
      <div
        {...getRootProps()}
        className={`p-8 m-4 border-2 bg-stone-200 ${
          isDragActive ? 'border-green-500' : isFocused ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-500">Drop the images here...</p>
        ) : (
          <p>Drag and drop up to {MAX_FILES_CAP} images here, or click to select.</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center">{filePreviews}</div>
    </div>
  )
}

export default FilesDropper
