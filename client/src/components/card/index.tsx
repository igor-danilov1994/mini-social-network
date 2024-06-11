import type { FC } from "react"
import { memo, useMemo, useState } from "react"
import type { CardProps } from "@nextui-org/react"
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react"
import { Link, useNavigate } from "react-router-dom"
import { RiDeleteBinLine } from "react-icons/ri"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { FaRegComment } from "react-icons/fa"

import type { Post } from "../../app/types"
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../app/services/likeApi"
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../app/services/postApi"
import { useDeleteCommentMutation } from "../../app/services/commentsApi"
import { useAppSelector } from "../../app/hooks"
import { CustomUser } from "../user"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { Typography } from "../typography"
import { MetaInfo } from "../meta-info"
import { exhaustingCheck } from "../../utils/exhaustingCheck"

type CardType = CardProps & Post

interface CustomCardProps extends CardType {
  cardFor: "comment" | "post" | "current-post"
  id: string
  postId?: string
}

export const CustomCard: FC<CustomCardProps> = memo(props => {
  const {
    id,
    authorId,
    cardFor,
    likedByUser,
    createdAt,
    comments,
    likes,
    content,
    postId,
  } = props

  const [likePost, { isLoading: isLoadingLike }] = useLikePostMutation()
  const [unlikePost, { isLoading: isLoadingUnlike }] = useUnlikePostMutation()
  const [triggerAllPost] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState()
  const navigate = useNavigate()
  const current = useAppSelector(state => state.userReduces.current)

  // @ts-ignore
  const authorIdId = authorId?._id
  const owner = authorIdId === current?.id

  const reFetchPost = async () => {
    switch (cardFor) {
      case "post":
        await triggerAllPost().unwrap()
        break
      case "current-post":
        await triggerGetPostById(id).unwrap()
        break
      case "comment":
        await triggerGetPostById(postId ?? "").unwrap()
        break
      default:
        exhaustingCheck(cardFor)
        throw new Error("Wrong args!")
    }
  }

  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "post":
          await deletePost(id).unwrap()
          await reFetchPost()
          navigate("/")
          break
        case "current-post":
          await deletePost(id).unwrap()
          navigate("/")
          break
        case "comment":
          await deleteComment(id).unwrap()
          await reFetchPost()
          break
        default:
          exhaustingCheck(cardFor)

          throw new Error("Wrong arg card")
      }
    } catch (e) {
      console.log("handleDelete", e)
    }
  }

  const handleLikeClick = async () => {
    if (!isLoadingLike && !isLoadingUnlike) {
      try {
        if (likedByUser) {
          await unlikePost(id).unwrap()
        } else {
          await likePost({ postId: id }).unwrap()
        }
        await reFetchPost()
      } catch (e) {
        console.log("handleLikeClick", e)
      }
    }
  }

  const deleteButton = useMemo(() => {
    return (
      <div className="cursor-pointer" onClick={handleDelete}>
        {deleteCommentStatus.isLoading || deleteCommentStatus.isLoading ? (
          <Spinner />
        ) : (
          <RiDeleteBinLine />
        )}
      </div>
    )
  }, [deleteCommentStatus, deleteCommentStatus, id])

  return (
    <Card className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorIdId}`}>
          <CustomUser
            className="text-small font-semibold leading-none text-default-600"
            name={authorId?.name}
            avatarUrl={authorId?.avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {owner && deleteButton}
      </CardHeader>

      <CardBody className="px-3 py-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>
      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex fap-5 items-center">
            {likes && (
              <div onClick={handleLikeClick}>
                <MetaInfo
                  count={likes.length}
                  Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                />
              </div>
            )}
            {comments && (
              <Link to={`posts/${id}`}>
                <MetaInfo count={comments.length} Icon={FaRegComment} />
              </Link>
            )}
          </div>
          {error}
        </CardFooter>
      )}
    </Card>
  )
})
