import Router from "next/router"
import ReactMarkdown from "react-markdown"
import { FragmentType, graphql, useFragment } from "../lib/gql"

const PostFragment = graphql(`
  fragment PostItem on Post {
    id
    title
    content
    published
    author {
      name
    }
  }
`)

const Post = (props: { post: FragmentType<typeof PostFragment> }) => {
  const post = useFragment(PostFragment, props.post)
  const authorName = post.author ? post.author.name : "Unknown author"
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content ?? "no content"} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  )
}

export default Post
