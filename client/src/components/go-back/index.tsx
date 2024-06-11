import type { FC } from "react"
import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { FaRegArrowAltCircleLeft } from "react-icons/fa"

interface GoBackProps {}

export const GoBack: FC<GoBackProps> = memo(props => {
  const {} = props
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(-1)
  }

  return (
    <div
      className="text-default-500 flex item-center gap-2 mb-10 cursor-pointer"
      onClick={handleClick}
    >
      <FaRegArrowAltCircleLeft />
      Назад
    </div>
  )
})
