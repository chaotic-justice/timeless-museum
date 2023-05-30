import Image from "next/image"
import { Artwork } from "../library/gql/graphql"
import { useRouter } from "next/router"

const ImageWithDimensions = ({ artwork }: { artwork: Artwork }) => {
  const router = useRouter()
  const displayArt = (id: String) => {
    router.push(`/artpiece/${id}`)
  }

  return (
    <div
      key={artwork.id}
      className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      <Image
        priority
        className="w-auto h-auto object-cover object-center"
        height={240}
        width={300}
        src={artwork.imageUrls[0]}
        alt={artwork.description ?? "alt"}
        onClick={() => displayArt(artwork.id)}
      />
      <div className="p-4">
        <h2 className="text-gray-900 font-bold text-2xl mb-2">{artwork.title}</h2>
        <p className="text-gray-800 text-base">{artwork.description}</p>
      </div>
    </div>
  )
}

const Gallery: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-center mb-8">Digital Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((artwork) => (
          <ImageWithDimensions key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}
export default Gallery