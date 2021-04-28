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
import { SecondForm } from "./SecondForm"

const EditTodoForm = ({ todo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [updateTodoMutation] = useMutation(updateTodo)

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Edit
      </Button>
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
                    console.log("values", values)
                    await updateTodoMutation(values)
                    // Router.reload()
                  } catch (error) {
                    console.error(error)
                    return {
                      // [FORM_ERROR]: error.toString(),
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
