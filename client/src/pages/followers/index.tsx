import type { FC } from "react"
import { memo } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody } from "@nextui-org/react"

import { useCurrentQuery } from "../../app/services/userApi"
import { CustomUser } from "../../components/user"

export const Followers: FC = memo(props => {
  const { data } = useCurrentQuery()

  if (!data?.followers?.length) {
    return <h2>Подписчиков нет!</h2>
  }

  return (
    <div>
      <h1 className="mb-5">Подписчиков: {data?.followers?.length}</h1>
      {data.followers.map(user => {
        return (
          <Card>
            <CardBody>
              <Link to={`/users/${user.followingId}`} key={user.followingId}>
                <CustomUser
                  avatarUrl={user.followerId.avatarUrl}
                  name={user.followerId.name}
                  description={user.followerId.email}
                />
              </Link>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
})
