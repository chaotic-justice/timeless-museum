import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { GetStaticProps } from "next"
import Gallery from "../components/Gallery"
import Layout from "../components/Layout"
import { getPhotographsDocument } from "../lib/documents"

const Wall = () => {
  const { data } = useQuery({ queryKey: ["photographs"], queryFn: () => getPhotographs() })
  if (data?.getPhotographs === undefined) return

  return (
    <Layout>
      <Gallery images={data?.getPhotographs} />
    </Layout>
  )
}

const getPhotographs = async () => await request("http://localhost:3000/api/graphql", getPhotographsDocument)

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["photographs"],
    queryFn: () => getPhotographs(),
    staleTime: 60 * 1000 * 15,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Wall
