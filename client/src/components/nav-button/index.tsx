import type { FC, ReactNode } from "react"
import { memo } from "react"
import { CustomButton } from "../button"
import { Link } from "react-router-dom"

interface NavButtonProps {
  children?: ReactNode
  icon?: JSX.Element
  href: string
}

export const NavButton: FC<NavButtonProps> = memo(props => {
  const { icon, children, href } = props

  return (
    <CustomButton className="flex justify-start text-xl" icon={icon}>
      <Link to={href}>{children}</Link>
    </CustomButton>
  )
})
