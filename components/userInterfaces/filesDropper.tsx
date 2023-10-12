import React, { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { IMAGE_MAX_SIZE, IMAGE_MIN_SIZE, MAX_FILES_CAP } from '../../library/constants'
import { ImageObj } from '../../pages/upload-image'

type FilesDropperProps = {
  files: ImageObj[]
  fields: any[]
  replace: (obj: ImageObj[]) => void
}

const FilesDropper: React.FC<FilesDropperProps> = ({ files, fields, replace, ...rest }) => {
  const outOfRange = fields.length >= MAX_FILES_CAP
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      const droppedImages = droppedFiles.map(file => ({ image: file }))
      replace([...files, ...droppedImages].slice(0, MAX_FILES_CAP))
    },
    [files, replace]
  )
  const { getRootProps, getInputProps, fileRejections, isFocused, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: MAX_FILES_CAP,
    minSize: IMAGE_MIN_SIZE,
    maxSize: IMAGE_MAX_SIZE,
    accept: {
      'image/*': [],
    },
    disabled: outOfRange,
  })

  useEffect(() => {
    const rejectionErrors = fileRejections.map(({ file, errors }) => {
      const errorMessage = errors[0].message
      const imageName = file.name
      return `${errorMessage} - ${imageName}`
    })
    rejectionErrors.forEach(errorMessage => {
      toast.error(errorMessage, { duration: 2500 })
    })
  }, [fileRejections])

  return (
    <div
      {...getRootProps({ onClick: e => e.preventDefault(), ...rest })}
      className={`p-8 m-4 border-2 bg-gray-200 ${
        outOfRange ? 'cursor-not-allowed opacity-50 border-solid border-red-700' : 'cursor-pointer border-dotted'
      } ${isDragActive ? 'border-green-700' : isFocused ? 'border-blue-500' : 'border-green-500'}`}
    >
      <input {...getInputProps({ disabled: outOfRange })} />
      {isDragActive ? (
        <p className="text-green-500">Drop the images here...</p>
      ) : !outOfRange ? (
        <p>Drag and drop up to {MAX_FILES_CAP} images here, or click to select.</p>
      ) : (
        <p>Remove an image to proceed..</p>
      )}
    </div>
  )
}

export default FilesDropper
