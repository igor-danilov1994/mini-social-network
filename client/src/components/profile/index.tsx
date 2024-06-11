import type { FC } from "react"
import { memo } from "react"
import { Link } from "react-router-dom"
import { MdAlternateEmail } from "react-icons/md"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"

import { BASE_URL } from "../../app/services/api"
import { useAppSelector } from "../../app/hooks"

interface ProfileProps {}

export const Profile: FC<ProfileProps> = memo(props => {
  const current = useAppSelector(state => state.userReduces.current)

  if (!current) {
    return null
  }

  const { name, email, avatarUrl, bio, id } = current

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col">
        <Image src={`${BASE_URL}${avatarUrl}`} width={370} alt="profole" />
      </CardHeader>
      <CardBody>
        <Link to={`/users/${id}`}>
          <h4 className="font-bold text-large mb-2">{name}</h4>
        </Link>
        <p className="text-default-500 flex items-center gap-2">
          <MdAlternateEmail />
          {email}
        </p>
      </CardBody>
    </Card>
  )
})
