import { Button } from 'antd'
import Image from 'next/image'
import React from 'react'
import { GoTrash } from 'react-icons/go'
import { ImageObj } from '../../pages/upload-image'

type Props = { files: ImageObj[]; remove: (index?: number | number[]) => void }

const ImagePreviews: React.FC<Props> = ({ files, remove }) => {
  if (!Array.isArray(files) || !files.length) return null

  const filePreviews = files.map(
    ({ image }, idx) =>
      !!image && (
        <div key={image?.valueOf.name + '_' + idx} className="relative w-32 h-32 m-2">
          <Image
            src={URL.createObjectURL(image)}
            alt={image!.valueOf.name}
            width={240}
            height={300}
            className="object-cover w-full h-full rounded-lg"
          />
          <Button
            danger
            type="primary"
            icon={<GoTrash />}
            onClick={() => remove(idx)}
            className="absolute top-1 right-1"
          />
        </div>
      )
  )

  return <div className="flex flex-wrap justify-center">{filePreviews}</div>
}

export default ImagePreviews
