import { FC, memo } from "react"
import { Input, InputProps } from "@nextui-org/react"
import type { Control } from "react-hook-form"
import { useController } from "react-hook-form"

interface CustomInputProps extends InputProps {
  control: Control<any>
  name: string
}

export const CustomInput: FC<CustomInputProps> = props => {
  const { label, name, endContent, type, control, required, placeholder } =
    props

  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: {
      required,
    },
  })

  return (
    <Input
      id={name}
      label={label}
      type={type}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder={placeholder}
      errorMessage={`${errors[name]?.message ?? ""}`}
      required={required}
      {...control}
    />
  )
}
