import type { FC } from "react"
import { memo } from "react"
import { useParams } from "react-router-dom"

import { useGetPostByIdQuery } from "../../app/services/postApi"
import { CustomCard } from "../../components/card"
import { GoBack } from "../../components/go-back"
import { CreateComment } from "../../components/create-comment"

export const CurrentPost: FC = memo(props => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params.id ?? "")

  if (!data) {
    return <h2>Поста не сужествует</h2>
  }

  const {
    id,
    authorId,
    author,
    likedByUser,
    createdAt,
    comments,
    likes,
    content,
    updatedAt,
  } = data

  return (
    <>
      <GoBack />
      <CustomCard
        cardFor="current-post"
        id={id}
        author={author}
        authorId={authorId}
        likes={likes}
        comments={comments}
        likedByUser={likedByUser}
        createdAt={createdAt}
        updatedAt={updatedAt}
        content={content}
      />
      <div className="mt-10">
        {comments && (
          <>
            {comments.map(comment => {
              return (
                <CustomCard
                  key={comment._id}
                  cardFor="comment"
                  id={comment._id}
                  author={comment.userId}
                  authorId={comment.userId}
                  content={comment.content}
                  postId={id}
                />
              )
            })}
          </>
        )}
      </div>
      <CreateComment />
    </>
  )
})
