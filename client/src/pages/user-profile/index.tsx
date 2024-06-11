import type { FC } from "react"
import { memo } from "react"
import { useParams } from "react-router-dom"
import { Card, Image, useDisclosure } from "@nextui-org/react"
import { CiEdit } from "react-icons/ci"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"

import { useAppSelector } from "../../app/hooks"
import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { GoBack } from "../../components/go-back"
import { BASE_URL } from "../../app/services/api"
import { CustomButton } from "../../components/button"
import { ProfileInfo } from "../../components/profile-info"
import { EditProfile } from "../edit-profile"

export const UserProfile: FC = memo(props => {
  const params = useParams<{ id: string }>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [follow] = useFollowUserMutation()
  const [unfollow] = useUnfollowUserMutation()
  const [triggerGetUserById] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const currentUser = useAppSelector(state => state.userReduces.current)
  const { data } = useGetUserByIdQuery(params.id ?? "")

  const isOwner = currentUser?.id === params.id

  if (!data) {
    return <h1>Пользователя нет!</h1>
  }

  const {
    id,
    email,
    avatarUrl,
    name,
    isFollowing,
    following,
    bio,
    followers,
    dateOfBirth,
    location,
  } = data

  const handleFollow = async () => {
    if (id) {
      try {
        if (isFollowing) {
          await unfollow(id).unwrap()
        } else {
          await follow({ followingId: id }).unwrap()
        }
        await triggerGetUserById(id)
        await triggerCurrentQuery()
      } catch (e) {
        console.log("handleFollow", e)
      }
    }
  }

  const onCloseHandler = async () => {
    if (id) {
      onClose()
      await triggerGetUserById(id)
    }
  }

  return (
    <>
      <GoBack />
      <div className="flex items-center gap-4">
        <Card className="flex flex-col item-center text-center space-y-4 p-4">
          <Image
            src={`${BASE_URL}${avatarUrl}`}
            alt={name}
            width={200}
            height={200}
            className="border-4 border-white"
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {name}
          </div>
          {!isOwner ? (
            <CustomButton
              className="gap-2"
              color={isFollowing ? "default" : "primary"}
              variant="flat"
              onClick={handleFollow}
              endContent={
                isFollowing ? (
                  <MdOutlinePersonAddDisabled />
                ) : (
                  <MdOutlinePersonAddAlt1 />
                )
              }
            >
              {isFollowing ? "Отписаться" : "Подписаться"}
            </CustomButton>
          ) : (
            <CustomButton onClick={onOpen} endContent={<CiEdit />}>
              Редактировать
            </CustomButton>
          )}
        </Card>
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title="Почта" info={email} />
          <ProfileInfo title="Локация" info={location} />
          <ProfileInfo title="Дата рождения" info={dateOfBirth} />
          <ProfileInfo title="О пользователе" info={bio} />
          <ProfileInfo
            title="Колличество подписчиков"
            info={`${followers?.length}`}
          />
          <ProfileInfo
            title="Колличество подписок"
            info={`${following?.length}`}
          />
        </Card>
      </div>
      <EditProfile isOpen={isOpen} onClose={onCloseHandler} user={data} />
    </>
  )
})
