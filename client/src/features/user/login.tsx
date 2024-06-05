import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

import { CustomInput } from "../../components/input"
import { SelectedTab } from "../../pages/auth"
import { CustomButton } from "../../components/button"
import {
  useLazyCurrentQuery,
  useLoginMutation,
} from "../../app/services/userApi"

interface LoginProps {
  setSelected: (value: SelectedTab) => void
}

interface LoginPayload {
  email: string
  password: string
}

export const Login: FC<LoginProps> = props => {
  const { setSelected } = props

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginPayload>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login, { isLoading }] = useLoginMutation()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const navigate = useNavigate()
  const [error, setError] = useState()

  const onSubmit = async (data: LoginPayload) => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()

      navigate("/")
    } catch (error) {
      // @ts-ignore
      setError(error.data.error)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        label="Email"
        type="email"
        control={control}
        name="email"
        required
      />
      <CustomInput
        label="Password"
        type="password"
        control={control}
        name="password"
        required
      />
      <p className="text-start text-small">Нет аккаунта?</p>
      <Link
        className="cursor-pointer"
        onPress={() => setSelected("registration")}
      >
        Зарегестрироваться
      </Link>
      <div className="flex gap-2 justify-end">
        <CustomButton
          fullWidth
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          Войти
        </CustomButton>
      </div>
    </form>
  )
}
