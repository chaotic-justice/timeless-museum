import Image from 'next/image'
import Link from 'next/link'
import { Artwork } from '../library/gql/graphql'

const Gallery: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => {
  return (
    <div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 px-0 md:px-10">
        {artworks?.map((artwork, idx) => {
          return (
            <div className={`relative hover:scale-[103%] transition-transform duration-200 ease-in-out`} key={idx}>
              {/* create a white div that when hovered it appears */}
              <Link href={`/artpiece/${artwork.id}`} shallow>
                <div className="absolute flex justify-center items-center w-full h-full bg-white opacity-0 hover:opacity-80 transition-opacity duration-200 z-10">
                  <p className="text-center font-light text-lg p-5">{artwork.title}</p>
                </div>
                <Image
                  src={artwork.imageUrls[0]}
                  alt=""
                  height={800}
                  width={800}
                  className="w-full rounded-sm shadow-2xl drop-shadow-lg -z-10"
                />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Gallery
