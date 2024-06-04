import { FC, memo } from "react"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { BsPostcard } from "react-icons/bs"

import { NavButton } from "../nav-button"

interface NavBarProps {}

export const NavBar: FC<NavBarProps> = props => {
  console.log("NavBar")
  return (
    <nav>
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton href="/" icon={<BsPostcard />}>
            Посты
          </NavButton>
        </li>
        <li>
          <NavButton href="/following" icon={<FiUsers />}>
            Подписки
          </NavButton>
        </li>
        <li>
          <NavButton href="/followers" icon={<FaUsers />}>
            Подписчики
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}
