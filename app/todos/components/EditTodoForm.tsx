import { EditIcon } from "@chakra-ui/icons"
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Box,
} from "@chakra-ui/react"
import { Router, useMutation } from "blitz"
import React from "react"
import updateTodo from "../mutations/updateTodo"
import { FORM_ERROR, SecondForm } from "./SecondForm"

const EditTodoForm = ({ todo, arrayColumns, cookie }) => {
  function handleEdit(item) {
    const startTaskIds = [...arrayColumns.columns.start.taskIds]
    const progressTaskIds = [...arrayColumns.columns.progress.taskIds]
    const completedTaskIds = [...arrayColumns.columns.completed.taskIds]
    if (startTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      const filteredArray = startTaskIds.filter((list) => list.id !== item.id)
      console.log("taskIds:", [...filteredArray, item])
      return cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            start: {
              ...arrayColumns.columns.start,
              taskIds: [...filteredArray, item],
            },
          },
        })
      )
    } else if (progressTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      console.log(
        "if in progress",
        progressTaskIds.find((predicate) => predicate.id === item.id)
      )
      console.log("handleprogressTask if working")
      const filteredArray = progressTaskIds.filter((list) => list.id !== item.id)
      return cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            progress: {
              ...arrayColumns.columns.progress,
              taskIds: [...filteredArray, item],
            },
          },
        })
      )
    } else if (completedTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      console.log(
        "if in completed",
        progressTaskIds.find((predicate) => predicate.id === item.id)
      )
      console.log("handlecompletedTask if working")
      const filteredArray = completedTaskIds.filter((list) => list.id !== item.id)
      return cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            completed: {
              ...arrayColumns.columns.completed,
              taskIds: [...filteredArray, item],
            },
          },
        })
      )
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [updateTodoMutation] = useMutation(updateTodo)

  return (
    <>
      <Box
        _hover={{ cursor: "pointer" }}
        d="flex"
        justifyContent="flex-end"
        paddingTop="5px"
        paddingRight="5px"
      >
        <EditIcon ref={btnRef} w={5} h={5} onClick={onOpen} />
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Edit {todo.name} </DrawerHeader>

            <DrawerBody>
              <Box w="100%" h="40vh" borderBottom="1px solid black">
                {todo.information}
              </Box>

              <SecondForm
                name="Todo"
                submitText="Save"
                // TODO use a zod schema for form validation
                //  - Tip: extract mutation's schema into a shared `validations.ts` file and
                //         then import and use it here
                // schema={CreateTodo}
                initialValues={{ id: todo.id, name: todo.name, information: todo.information }}
                onSubmit={async (values) => {
                  try {
                    const updatedTodo = await updateTodoMutation(values)
                    console.log("before handle edit")
                    handleEdit(updatedTodo)
                    //Router.reload()
                  } catch (error) {
                    console.error(error)
                    return {
                      [FORM_ERROR]: error.toString(),
                    }
                  }
                }}
              />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default EditTodoForm
