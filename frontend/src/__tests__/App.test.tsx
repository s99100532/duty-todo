import { jest, expect, describe, it } from '@jest/globals'
import App from '../App'
import { fireEvent, render, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom/jest-globals"
import fetcher from '../fetcher'
import { randomUUID } from 'node:crypto';
import { SWRConfig } from 'swr'

const generateDuty = (prefix: string = "") => ({
  "id": randomUUID(),
  "name": prefix + Math.random().toString(36).slice(-5),
  "created_at": new Date().toISOString()
})






jest.mock('../fetcher', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('show duty', () => {

  it('should show the duty from api', async () => {
    const testDuty = generateDuty("show");

    (fetcher.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      "message": "",
      "success": true,
      "data": {
        "items": [
          testDuty
        ],
        "pagination": {
          "cursor": testDuty.id
        }
      }
    }))

    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)

    const ele = await app.findByText(testDuty.name)

    expect(ele).toHaveTextContent(testDuty.name)

  })
  it('should show error if invalid api response', async () => {
    const testDuty = generateDuty("show error");

    const errorMessage = "invalid id";

    (fetcher.get as jest.Mock).mockImplementation(() => Promise.resolve({
      "message": errorMessage,
      "success": false,
      "data": {
        "items": [
          testDuty
        ],
        "pagination": {
          "cursor": testDuty.id
        }
      }
    }))

    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)

    await waitFor(() => expect(fetcher.get).toBeCalledTimes(1))

    const ele = await app.findByText(errorMessage)

    expect(ele).toHaveTextContent(errorMessage)


  })
})


describe("create duty", () => {
  it('should post data for form data', async () => {
    const testDuty = generateDuty("create");

    (fetcher.get as jest.Mock).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [],
          "pagination": {
            "cursor": null
          }
        }
      })).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [
            testDuty
          ],
          "pagination": {
            "cursor": null
          }
        }
      }));

    (fetcher.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      "message": "",
      "success": true,
      "data": testDuty
    }))

    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)


    expect(app.queryByRole("listitem")).toBeNull()


    const createBtn = await app.findByRole('button', {
      name: /create new duty/i
    })

    fireEvent(
      createBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    const input = await app.findByRole('textbox');

    fireEvent.change(input, { target: { value: testDuty.name } })

    const submitBtn = await app.findByRole('button', {
      name: /OK/i
    })

    fireEvent(
      submitBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    await waitFor(() => expect(fetcher.post).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(fetcher.get).toHaveBeenCalledTimes(2))

    expect(app.queryByRole("listitem")).not.toBeNull()



  })
  it('should validate data before submit', async () => {

    (fetcher.get as jest.Mock).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [],
          "pagination": {
            "cursor": null
          }
        }
      }))


    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)



    const createBtn = await app.findByRole('button', {
      name: /create new duty/i
    })

    fireEvent(
      createBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    const input = await app.findByRole('textbox');

    fireEvent.change(input, { target: { value: "" } })

    const submitBtn = await app.findByRole('button', {
      name: /OK/i
    })

    fireEvent(
      submitBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    const alertText = await app.findByRole("alert")

    expect(alertText).toHaveTextContent(/String must contain/)

    expect(fetcher.post).not.toBeCalled()



  })
})
describe("update duty", () => {
  it('should show updated data', async () => {
    const testDutyBefore = generateDuty("update");
    const testDutyAfter = {
      ...testDutyBefore,
      name: generateDuty("update").name
    };

    expect(testDutyBefore.name).not.toEqual(testDutyAfter.name);

    (fetcher.get as jest.Mock).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [testDutyBefore],
          "pagination": {
            "cursor": null
          }
        }
      })).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [
            testDutyAfter
          ],
          "pagination": {
            "cursor": null
          }
        }
      }));

    (fetcher.patch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      "message": "",
      "success": true,
      "data": testDutyAfter
    }))

    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)

    const ele = await app.findByText(testDutyBefore.name)

    expect(ele).toHaveTextContent(testDutyBefore.name)


    const editBtn = await app.findByRole('button', {
      name: /Edit/i
    })

    fireEvent(
      editBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    const input = await app.findByRole('textbox');

    fireEvent.change(input, { target: { value: testDutyAfter.name } })

    const submitBtn = await app.findByRole('button', {
      name: /OK/i
    })

    fireEvent(
      submitBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    await waitFor(() => expect(fetcher.patch).toHaveBeenCalledWith(`/duty/${testDutyBefore.id}`, {
      name: testDutyAfter.name
    }))
    await waitFor(() => expect(fetcher.get).toHaveBeenCalledTimes(2))

    const newEle = await app.findByText(testDutyAfter.name)

    expect(newEle).toHaveTextContent(testDutyAfter.name)

  })
})
describe("delete duty", () => {
  it('should not visible after delete', async () => {

    const testDuty = generateDuty("delete");


    (fetcher.get as jest.Mock).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [testDuty],
          "pagination": {
            "cursor": null
          }
        }
      })).
      mockImplementationOnce(() => Promise.resolve({
        "message": "",
        "success": true,
        "data": {
          "items": [
          ],
          "pagination": {
            "cursor": null
          }
        }
      }));

    (fetcher.delete as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      "message": "",
      "success": true,
      "data": null
    }))

    const app = render(<SWRConfig value={{ provider: () => new Map() }}>
      <App /></SWRConfig>)

    const ele = await app.findByText(testDuty.name)

    expect(ele).toHaveTextContent(testDuty.name)


    const editBtn = await app.findByRole('button', {
      name: /Delete/i
    })

    fireEvent(
      editBtn,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    const confirmBtn = await app.findByRole('button', {
      name: /Yes/i
    });

    fireEvent.click(confirmBtn)


    await waitFor(() => expect(fetcher.delete).toHaveBeenCalledWith(`/duty/${testDuty.id}`))
    await waitFor(() => expect(fetcher.get).toHaveBeenCalledTimes(2))


    const deleteEle = await app.queryByText(testDuty.name)

    expect(deleteEle).toBeNull()


  })
})
