import Image from "next/image"
import { Alert, Card } from "flowbite-react"
import { Photograph } from "../library/gql/graphql"

const ImageWithDimensions = ({ photo }: { photo: Photograph }) => {
  return (
    <div className="max-w-sm">
      <Card imgSrc={photo.imageUrl} className="max-h-full">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{photo.title}</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">{photo.description}</p>
      </Card>
    </div>
  )
}

const Gallery: React.FC<{ images: Photograph[] }> = ({ images }) => {
  return (
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <Alert color="info">Alert!</Alert>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => {
          return <ImageWithDimensions key={img.id} photo={img} />
        })}
      </div>
    </div>
  )
}
export default Gallery
