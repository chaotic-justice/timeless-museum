import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { InferGetServerSidePropsType } from "next"
import Layout from "../components/Layout"
import Post from "../components/Post"
import { graphql } from "../lib/gql"

const draftsQueryDocument = graphql(`
  query DraftsQuery {
    drafts {
      id
      ...PostItem
    }
  }
`)

const Drafts = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!props.data) return
  return (
    <Layout>
      <div className="page">
        <h1>Drafts</h1>
        <main>
          {props.data.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
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

export const getServerSideProps = async () => {
  const { data } = useQuery(["drafts"], async () => request("localhost:3000/api/graphql", draftsQueryDocument))

  return {
    props: {
      data,
    },
  }
}

export default Drafts
