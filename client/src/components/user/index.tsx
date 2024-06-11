import type { FC } from "react"
import { memo } from "react"
import type { UserProps } from "@nextui-org/react"
import { User } from "@nextui-org/react"

import type { User as UserType } from "../../app/types"
import { BASE_URL } from "../../app/services/api"

type CustomUserType = UserProps & UserType

interface CustomUserProps extends CustomUserType {}

export const CustomUser: FC<CustomUserProps> = memo(props => {
  const { avatarUrl, id, className } = props

  return (
    <User
      id={id}
      className={className}
      avatarProps={{
        src: `${BASE_URL}${avatarUrl}`,
      }}
      {...props}
    />
  )
})
