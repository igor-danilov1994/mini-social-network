import type { FC } from "react"
import { memo } from "react"
import { useGetAllPostsQuery } from "../../app/services/postApi"
import { CreatePost } from "../../components/create-post"
import { CustomCard } from "../../components/card"

export const Posts: FC = memo(props => {
  const { data } = useGetAllPostsQuery()

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      {data && data.length > 0 && (
        <>
          {data.map(post => {
            return (
              <CustomCard
                key={post.id}
                cardFor={"post"}
                author={post.author}
                authorId={post.authorId}
                likes={post.likes}
                comments={post.comments}
                likedByUser={post.likedByUser}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
                id={post.id}
                content={post.content}
              />
            )
          })}
        </>
      )}
    </>
  )
})
