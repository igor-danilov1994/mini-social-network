import type { FC } from "react"
import { memo } from "react"
import { Controller, useForm } from "react-hook-form"
import { IoMdCreate } from "react-icons/io"
import { Textarea } from "@nextui-org/react"
import { useParams } from "react-router-dom"

import { CustomButton } from "../button"
import { useCreateCommentMutation } from "../../app/services/commentsApi"
import { useLazyGetPostByIdQuery } from "../../app/services/postApi"

interface CreateCommentProps {}

export const CreateComment: FC<CreateCommentProps> = memo(props => {
  const { id } = useParams<{ id: string }>()
  const [createComment] = useCreateCommentMutation()
  const [getPostById] = useLazyGetPostByIdQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const error = errors?.root?.message

  const onSubmit = handleSubmit(async data => {
    try {
      await createComment({ content: data.comment, postId: id ?? "" }).unwrap()
      await getPostById(id ?? "").unwrap()

      setValue("comment", "")
    } catch (e) {
      console.log(e)
    }
  })

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{
          required: "required!",
        }}
        render={({ field }) => {
          return (
            <Textarea
              {...field}
              labelPlacement="outside"
              placeholder="Твой комментарий"
              className="mb-5"
            />
          )
        }}
      />
      <CustomButton
        color="success"
        className="flex-end"
        type="submit"
        endContent={<IoMdCreate />}
      >
        Добавить комментарий
      </CustomButton>
    </form>
  )
})
