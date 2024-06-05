import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "@nextui-org/react"

import { CustomInput } from "../../components/input"
import { SelectedTab } from "../../pages/auth"
import { CustomButton } from "../../components/button"
import { useRegisterMutation } from "../../app/services/userApi"
import { hasErrorField } from "../../utils/has-error-field"

interface RegistrationProps {
  setSelected: (value: SelectedTab) => void
}

interface RegistrationPayload {
  email: string
  password: string
  name: string
}

export const Registration: FC<RegistrationProps> = props => {
  const { setSelected } = props

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationPayload>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState()

  const onSubmit = async (data: RegistrationPayload) => {
    try {
      await register(data).unwrap()

      setSelected("login")
    } catch (e) {
      if (hasErrorField(error)) {
        // @ts-ignore
        setError(error.data.error)
      }
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
      <CustomInput
        label="Name"
        type="text"
        control={control}
        name="name"
        required
      />
      <p className="text-start text-small">Уже есть аккаунт?</p>
      <Link className="cursor-pointer" onPress={() => setSelected("login")}>
        Войдите
      </Link>
      <div className="flex gap-2 justify-end">
        <CustomButton
          fullWidth
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          Регистрация
        </CustomButton>
      </div>
    </form>
  )
}
