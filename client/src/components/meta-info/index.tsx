import type { FC } from "react"
import { memo } from "react"
import type { IconType } from "react-icons"

import { Typography } from "../typography"

interface MetaInfoProps {
  count: number
  Icon: IconType
}

export const MetaInfo: FC<MetaInfoProps> = memo(props => {
  const { count, Icon } = props

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {count > 0 && (
        <Typography className="font-semibold text-danger-400 text-1">
          {`${count}`}
        </Typography>
      )}
      <p className="text-default-400 text-xl hover:text-2x1 ease-in duration-100 mr-2">
        <Icon />
      </p>
    </div>
  )
})
