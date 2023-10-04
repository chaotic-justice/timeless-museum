import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { IMAGE_MAX_SIZE, MAX_FILES_CAP } from '../../library/constants'

type FilesDropperProps = {
  onChange: (...event: any[]) => void
  files: File[]
}

const FilesDropper: React.FC<FilesDropperProps> = ({ onChange, files, ...rest }) => {
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      onChange([...files, ...droppedFiles].slice(0, MAX_FILES_CAP))
    },
    [files, onChange]
  )
  const { getRootProps, getInputProps, fileRejections, isFocused, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: MAX_FILES_CAP,
    // minSize: IMAGE_MIN_SIZE,
    maxSize: IMAGE_MAX_SIZE,
    accept: {
      'image/*': [],
    },
    disabled: files.length >= MAX_FILES_CAP,
  })

  // useEffect(() => {
  //   setFiles(prevFiles => [...prevFiles, ...acceptedFiles].slice(0, MAX_FILES_CAP))
  // }, [acceptedFiles])

  // useEffect(() => {
  //   // Clean up files when component unmounts
  //   return () => {
  //     setFiles([])
  //   }
  // }, [])

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
        files.length >= MAX_FILES_CAP ? 'cursor-not-allowed opacity-50 border-solid' : 'cursor-pointer border-dotted'
      } ${isDragActive ? 'border-green-700' : isFocused ? 'border-blue-500' : 'border-green-500'}`}
    >
      <input {...getInputProps({ disabled: files.length >= MAX_FILES_CAP })} />
      {isDragActive ? (
        <p className="text-green-500">Drop the images here...</p>
      ) : files.length < MAX_FILES_CAP ? (
        <p>Drag and drop up to {MAX_FILES_CAP} images here, or click to select.</p>
      ) : (
        <p>Remove an image to proceed..</p>
      )}
    </div>
  )
}

export default FilesDropper
