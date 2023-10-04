import { Button } from 'antd'
import Image from 'next/image'
import React from 'react'
import { GoTrash } from 'react-icons/go'
import { FormSchema } from '../../pages/upload-image'
import { UseFormSetValue } from 'react-hook-form'

const ImagePreviews: React.FC<{ files: File[]; setValues: UseFormSetValue<FormSchema> }> = ({ files, setValues }) => {
  const removeFile = (e: React.MouseEvent<HTMLElement, MouseEvent>, file: File) => {
    e.preventDefault()
    // TODO: replace setvalue with onchange?
    setValues(
      'images',
      files.filter(f => f !== file)
    )
  }

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
        onClick={e => removeFile(e, file)}
        className="absolute top-1 right-1"
      />
    </div>
  ))

  if (!files.length) return null
  return <div className="flex flex-wrap justify-center">{filePreviews}</div>
}

export default ImagePreviews
