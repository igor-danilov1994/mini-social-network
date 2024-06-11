import type { FC } from "react"
import { memo } from "react"
import { Controller, useForm } from "react-hook-form"
import { IoMdCreate } from "react-icons/io"
import { Textarea } from "@nextui-org/react"

import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "../../app/services/postApi"
import { CustomButton } from "../button"

interface CreatePostProps {}

export const CreatePost: FC<CreatePostProps> = memo(props => {
  const [createPost] = useCreatePostMutation()
  const [triggerAllPosts] = useLazyGetAllPostsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const error = errors?.root?.message

  const onSubmit = handleSubmit(async data => {
    try {
      await createPost({ content: data.post }).unwrap()
      await triggerAllPosts().unwrap()

      setValue("post", "")
    } catch (e) {
      console.log(e)
    }
  })

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="post"
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
              placeholder="О чем думаете?"
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
        Добавить пост
      </CustomButton>
    </form>
  )
})
