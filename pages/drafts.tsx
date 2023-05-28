import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Post, { PostFragment } from "../components/Post"
import { graphql, useFragment } from "../library/gql"

const draftsQueryDocument = graphql(`
  query GetDrafts {
    drafts {
      ...PostItem
    }
  }
`)

const getDrafts = async () => await request(process.env.NEXT_PUBLIC_GQL_API as string, draftsQueryDocument)

const Drafts = () => {
  const { data } = useQuery({ queryKey: ["drafts"], queryFn: getDrafts })
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const drafts = data?.drafts.map((d) => useFragment(PostFragment, d))
  if (!drafts) return

  return (
    <Layout>
      <div className="page">
        <h1>Drafts</h1>
        <main>
          {drafts.map((draft) => {
            return (
              <div key={draft.id} className="post">
                <Post post={draft} />
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
