import { APIResponse, Duty, PaginationData } from "@/shared/types";
import { App as AntApp, Button, Card, Flex, Popconfirm, Spin, message } from 'antd';
import { createContext, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import DutyForm from './components/DutyForm';
import TopBar from './components/TopBar';
import { PageMode } from './constants';
import fetcher from "./fetcher";




type AppContext = {
  mode: PageMode,
  editItem?: (duty: Duty) => void,
  createItem: () => void,
  resetPage: () => void
}

export const AppContext = createContext<AppContext>({
  mode: 'view',
  createItem: () => { },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editItem: (_: Duty) => { },
  resetPage: () => { }
});

function App() {

  const [mode, setMode] = useState<PageMode>('view')


  const { mutate } = useSWRConfig()


  const [editingItem, setEditItem] = useState<Duty | undefined>(undefined)

  const editItem = (item: Duty) => {
    setEditItem({ ...item })
    setMode('upsert')
  }

  const createItem = () => {
    setEditItem(undefined)
    setMode('upsert')
  }

  const resetPage = () => {
    setEditItem(undefined)
    setMode('view')
  }

  const deleteItem = async (id: string) => {

    try {
      const result = await fetcher.delete(`/duty/${id}`)

      if (result.success) {
        message.success("deleted")
        await mutate('/duties?pageSize=10');
      } else {
        message.error(result.message)
      }
    } catch(error) {
      message.error((error as Error).message)
    }
   
  }

  const { data, error, isLoading } = useSWR<APIResponse<PaginationData<Duty>>>('/duties?pageSize=10', fetcher.get)  

  

  return (
    <AppContext.Provider value={{
      mode,
      editItem,
      createItem,
      resetPage
    }}>
      <AntApp>
        <Flex vertical>
          <Flex>
            <TopBar />
          </Flex>
          <section style={{ padding: 10 }}>
            <Flex justify="start" wrap="wrap" role="list">
              {
                isLoading ? <Spin /> : (
                  !data?.success
                    ? (data?.message ? data.message : error.message)
                    : data.data?.items.map(item => (<div key={item.id} style={{ margin: 10 }} role="listitem" className="duty-card">
                      <Card title={item.name}>
                        <Flex justify='center'>
                          <Button onClick={() => editItem(item)} type="primary">Edit</Button>
                          <Popconfirm
                            data-testid={item.name}
                            title="Delete the Duty"
                            description="Are you sure to delete?"
                            onConfirm={() => deleteItem(item.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button danger>Delete</Button>
                          </Popconfirm>
                        </Flex>
                      </Card>
                    </div>))
                )
              }
            </Flex>
          </section>
        </Flex>
        <DutyForm data={editingItem} />
      </AntApp>
    </AppContext.Provider>
  )
}

export default App
