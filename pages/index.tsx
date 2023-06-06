import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import Gallery from "../components/Gallery"
import Layout from "../components/layout/Layout"
import { getArtworks } from "../library/hooks"

const Wall = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = useQuery({ queryKey: ["photographs"], queryFn: () => getArtworks() })
  if (data?.getArtworks === undefined) return

  return (
    <Layout>
      <Gallery artworks={data?.getArtworks} />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["photographs"],
    queryFn: () => getArtworks(),
    staleTime: 60 * 1000 * 15,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Wall
