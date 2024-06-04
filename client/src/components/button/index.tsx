import { FC, JSX, memo } from "react"
import { Button, ButtonProps } from "@nextui-org/react"

interface CustomButtonProps extends ButtonProps {
  icon?: JSX.Element
}

export const CustomButton: FC<CustomButtonProps> = memo(props => {
  const { children, className, fullWidth, icon, type, color } = props

  return (
    <Button
      className=""
      startContent={icon}
      size="lg"
      color={color}
      variant="light"
      type={type}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  )
})
