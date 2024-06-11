import type { FC } from "react"
import { memo } from "react"

interface TypographyProps {
  children?: string
  size?: string
  className?: string
}

export const Typography: FC<TypographyProps> = memo(props => {
  const { children, className = "text-xl" } = props

  return <p className={className}>{children}</p>
})
