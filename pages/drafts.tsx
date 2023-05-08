import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Layout from "../components/Layout"
import Post, { PostFragment } from "../components/Post"
import { graphql, useFragment } from "../lib/gql"

const draftsQueryDocument = graphql(`
  query DraftsQuery {
    drafts {
      ...PostItem
    }
  }
`)

const getDrafts = async () => await request("http://localhost:3000/api/graphql", draftsQueryDocument)

const Drafts = () => {
  const { data } = useQuery({ queryKey: ["drafts"], queryFn: getDrafts })
  if (!data) return

  return (
    <Layout>
      <div className="page">
        <h1>Drafts</h1>
        <main>
          {data.drafts.map((p) => {
            const post = useFragment(PostFragment, p)
            return (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            )
          })}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["raw-drafts"],
    queryFn: getDrafts,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Drafts
