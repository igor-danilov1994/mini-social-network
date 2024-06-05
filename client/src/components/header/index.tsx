import { FC, ReactNode, useContext } from "react"
import { ThemeContext } from "../them-provider"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { FaRegMoon } from "react-icons/fa"
import { LuSunMedium } from "react-icons/lu"
import { CustomButton } from "../button"
import { logout } from "../../features/user/userSlice"
import { useAppDispatch } from "../../app/hooks"
import { CiLogout } from "react-icons/ci"

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const dispatch = useAppDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Network Social</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem
          className="lg:flex text-3xl cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === "light" ? <FaRegMoon /> : <LuSunMedium />}
        </NavbarItem>
        <NavbarItem>
          <CustomButton variant="flat" onClick={logoutHandler}>
            <CiLogout />
            <span>Выйти</span>
          </CustomButton>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
