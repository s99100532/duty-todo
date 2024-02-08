import { Button, Flex } from "antd"
import { useContext } from "react"
import { AppContext } from "../App"

const TopBar: React.FC = () => {

  const { createItem } = useContext(AppContext)

  const createDuty = () => {
    createItem()
  }

  return (
    <div style={{ minHeight: 30, backgroundColor: "#cecece", padding: 25, width: "100%" }}>
      <Flex justify="flex-end" >
        <Button name="create-duty" onClick={createDuty}>Create New Duty</Button>
      </Flex>
    </div>
  )
}


export default TopBar