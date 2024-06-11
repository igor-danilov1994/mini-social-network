import type { FC } from "react"
import { useContext, useState } from "react"
import { memo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { MdOutlineEmail } from "react-icons/md"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"

import type { User } from "../../app/types"
import { ThemeContext } from "../../components/them-provider"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { CustomInput } from "../../components/input"
import { CustomButton } from "../../components/button"

interface EditProfileProps {
  isOpen?: boolean
  onClose: () => void
  user?: User
}

export const EditProfile: FC<EditProfileProps> = memo(props => {
  const { id } = useParams<{ id: string }>()
  const { isOpen, onClose, user } = props
  const { theme } = useContext(ThemeContext)
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [selectFile, setSelectFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
      avatarUrl: user?.avatarUrl,
    },
  })

  const submitHandler = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()

        selectFile && formData.append("avatar", selectFile)
        data.name && formData.append("name", data.name)
        data.bio && formData.append("bio", data.bio)
        data.email && formData.append("email", data.email)
        data.dateOfBirth && formData.append("dateOfBirth", data.dateOfBirth)
        data.location && formData.append("location", data.location)

        await updateUser({ userData: formData, id }).unwrap()
        onClose()
      } catch (e) {
        console.log(e)
        setError(`${e}`)
      }
    }
  }

  const onSelectFile = (files: FileList | null) => {
    if (!files) return

    const file = files[0] as File
    setSelectFile(file)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {() => {
          return (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Изменение профиля
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="flex flex-col gap-4"
                >
                  <CustomInput
                    control={control}
                    name="email"
                    label="Email"
                    endContent={<MdOutlineEmail />}
                  />
                  <CustomInput control={control} name="name" label="Name" />
                  <input
                    type="file"
                    name="avatar"
                    placeholder="Select file"
                    onChange={e => onSelectFile(e.target.files)}
                  />
                  <CustomInput
                    control={control}
                    name="dateOfBirth"
                    label="Date of birth"
                    type="date"
                    placeholder="My birth day"
                  />
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        rows={4}
                        placeholder="Ваша биография"
                        {...field}
                      />
                    )}
                  />
                  <CustomInput
                    control={control}
                    name="location"
                    label="Location"
                  />
                  <span>{error}</span>
                  <div className="flex gap-2 justify-end">
                    <CustomButton
                      fullWidth
                      color="primary"
                      type="submit"
                      isLoading={isLoading}
                    >
                      Обновить профиль
                    </CustomButton>
                  </div>
                </form>
              </ModalBody>
            </>
          )
        }}
      </ModalContent>
    </Modal>
  )
})
