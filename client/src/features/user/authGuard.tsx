import { FC, memo, ReactNode } from "react"
import { useCurrentQuery } from "../../app/services/userApi"
import { Spinner } from "@nextui-org/react"

interface AuthGuardProps {
  children: ReactNode
}

export const AuthGuard: FC<AuthGuardProps> = memo(props => {
  const { children } = props
  const { isLoading } = useCurrentQuery()

  if (isLoading) {
    return <Spinner />
  }

  return children
})
