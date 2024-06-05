import { FC, memo, useState } from "react"
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react"
import { Login } from "../../features/user/login"
import { Registration } from "../../features/user/registration"

export type SelectedTab = "login" | "registration"

export const Auth: FC = memo(props => {
  const [selected, setSelected] = useState<SelectedTab>("login")

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px] h-[450px]">
          <CardBody className="overflow-hidden">
            <Tabs
              size="md"
              fullWidth
              selectedKey={selected}
              onSelectionChange={key => setSelected(key as SelectedTab)}
            >
              <Tab key="login" title="Вход">
                <Login setSelected={setSelected} />
              </Tab>
              <Tab key="registration" title="Регистрация">
                <Registration setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
})
