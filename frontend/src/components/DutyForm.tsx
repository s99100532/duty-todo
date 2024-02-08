import { Alert, App, Flex, Modal, Typography } from "antd"
import { useContext, useEffect } from "react"
import { AppContext } from "../App"
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useSWRConfig } from 'swr'
import { Duty } from "@/shared/types";
import fetcher from "../fetcher";

type Inputs = {
  name: string
}


const schema = z.object({
  name: z.string().min(3),
});

const defaultValues = {name: ''}

const DutyForm: React.FC<{
  data: Duty | undefined
}> = ({ data }) => {

  const { mode, resetPage } = useContext(AppContext)

  const isCreate = !data

  const { mutate } = useSWRConfig()

  const { message } = App.useApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues
  })

  useEffect(() => {

    reset(isCreate ? defaultValues : data)
  }, [reset, data, isCreate])


  async function onSubmit(formData: z.infer<typeof schema>) {
    try {
      const result = await (async () => {
        if (isCreate) {
          return fetcher.post("/duty", formData);

        } else {
          return fetcher.patch(`/duty/${data.id}`, formData)
        }
      })()

      if (result.success) {
        message.success("Success")
      } else {
        message.error(result.message)
      }


      await mutate('/duties?pageSize=10');
      resetPage()
    } catch(error) {
      message.error((error as Error).message)
    }

  }




  return (
    <Modal
      open={mode != 'view'}
      onOk={handleSubmit(onSubmit)}
      onCancel={resetPage}
    >
      <Typography.Title>{isCreate ? 'Create Form' : 'Edit Form'}</Typography.Title>
      <form id="upsert-duty" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Flex>
            <label style={{ paddingRight: 10 }} htmlFor="name">name</label>
            <input type="text" {...register("name")} />
          </Flex>
          {errors.name && <Alert role="alert" message={`name: ${errors.name.message}`} type="error" />}
        </div>
      </form>
    </Modal>
  )
}

export default DutyForm