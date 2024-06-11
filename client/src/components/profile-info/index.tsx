import type { FC } from "react"
import { memo } from "react"

interface ProfileInfoProps {
  title?: string
  info?: string
}

export const ProfileInfo: FC<ProfileInfoProps> = memo(props => {
  const { info, title } = props

  if (!info) {
    return null
  }

  return (
    <div className="">
      <p className="font-semibold">
        <span className="text-gray-500 mr-2">{title}</span>
        {info}
      </p>
    </div>
  )
})
