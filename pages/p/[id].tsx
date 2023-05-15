import { QueryClient, dehydrate, useMutation, useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { GetStaticPaths, GetStaticProps } from "next"
import Router, { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { PostFragment } from "../../components/Post"
import { getPostDocument, publishDocument } from "../../lib/documents"
import { useFragment } from "../../lib/gql"
import { PostItemFragment } from "../../lib/gql/graphql"
import prisma from "../../lib/prisma"

const Post = () => {
  const queryClient = new QueryClient()
  const {
    query: { id },
  } = useRouter()
  const { data } = useQuery({ queryKey: ["post", id], queryFn: () => GetPostById(id as string) })

  const { mutate, isLoading } = useMutation({
    mutationFn: async (postId: string) =>
      await request("http://localhost:3000/api/graphql", publishDocument, { id: postId }),
    // When mutate is called:
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["post", postId] })

      // Snapshot the previous value
      const prevPost = queryClient.getQueryData<PostItemFragment>(["post", postId])

      // Optimistically update to the new value
      if (prevPost) {
        queryClient.setQueryData<PostItemFragment>(["post", postId], {
          ...prevPost,
          published: true,
        })
      }

      return { prevPost }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, postId, context) => {
      if (context?.prevPost) {
        queryClient.setQueryData<PostItemFragment>(["post", postId], context.prevPost)
      }
      console.error("err:", err)
    },
    // Always refetch after error or success:
    onSettled: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })
  // const [deletePost] = useMutation(DeleteMutation)

  if (isLoading) {
    console.log("mutation loading")
  }

  if (!data || !data.post) return
  const { post: postFragment } = data

  const post = useFragment(PostFragment, postFragment)

  let title = post.title
  if (!post.published) {
    title = `${title} (Draft)`
  }

  const authorName = post.author ? post.author.name : "Unknown author"
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {authorName}</p>
        <p>{post.content}</p>
        {!post.published && (
          <button
            onClick={(e) => {
              mutate(post.id)
              Router.push("/")
            }}
          >
            Publish
          </button>
        )}
        <button
          onClick={async (e) => {
            // await deletePost({
            //   variables: {
            //     id,
            //   },
            // })
            Router.push("/")
          }}
        >
          Delete
        </button>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

const GetPostById = async (postId: string) =>
  await request("http://localhost:3000/api/graphql", getPostDocument, { id: postId })

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({})
  const paths = posts.map((post) => ({
    params: {
      id: String(post.id),
    },
  }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["post", params?.id],
    queryFn: () => GetPostById(params?.id as string),
    staleTime: 60 * 1000 * 15, // activate gc every 15mins
    // staleTime: 1500, // refresh the query every 15mins
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Post
