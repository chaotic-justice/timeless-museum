/* eslint-disable react/no-unknown-property */
import Router from "next/router"
import ReactMarkdown from "react-markdown"
import { PostItemFragment } from "../library/gql/graphql"

const Post = (props: { post: PostItemFragment }) => {
  const post = props.post
  const authorName = post.author ? post.author.name : "Unknown author"
  return (
    // TODO: replace push with link && enalbe shallow routing
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      {/* eslint-disable-next-line react/no-children-prop */}
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
