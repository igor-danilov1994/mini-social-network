import { FC, ReactNode, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { Header } from "../header"
import { Container } from "../container"
import { NavBar } from "../nav-bar"
import { useAppSelector } from "../../app/hooks"

interface LayoutProps {}

export const Layout: FC<LayoutProps> = props => {
  const isAuth = useAppSelector(state => state.userReduces.isAuth)
  const user = useAppSelector(state => state.userReduces.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate("/auth")
    }
  }, [isAuth])

  return (
    <>
      <Header />
      <Container>
        <div className="flex-2 p-4">
          <NavBar />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </Container>
    </>
  )
}
