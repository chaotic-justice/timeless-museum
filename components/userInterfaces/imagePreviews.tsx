import { Button } from 'antd'
import Image from 'next/image'
import React from 'react'
import { GoTrash } from 'react-icons/go'

type Props = { files: File[]; remove: (index?: number | number[]) => void }

const ImagePreviews: React.FC<Props> = ({ files, remove }) => {
  console.log('files', files)
  const filePreviews = files.map((file, idx) => (
    <div key={file.name + '_' + idx} className="relative w-32 h-32 m-2">
      <Image
        src={URL.createObjectURL(file)}
        alt={file.name}
        width={240}
        height={300}
        className="object-cover w-full h-full rounded-lg"
      />
      <Button danger type="primary" icon={<GoTrash />} onClick={() => remove(idx)} className="absolute top-1 right-1" />
    </div>
  ))

  if (!files.length) return null
  return <div className="flex flex-wrap justify-center">{filePreviews}</div>
}

export default ImagePreviews
