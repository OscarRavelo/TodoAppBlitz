import { AddIcon } from "@chakra-ui/icons"
import {
  Button,
  Circle,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { useMutation } from "blitz"
import React from "react"
import createTodo from "../mutations/createTodo"
import { FORM_ERROR, TodoForm } from "./TodoForm"

const CardBottom = ({ arrayColumns, cookie }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createTodoMutation] = useMutation(createTodo)
  return (
    <Flex
      h="100%"
      position={{ base: "relative" }}
      top={{ base: "-3" }}
      paddingRight="1rem"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Circle size={{ base: "35px", lg: "40px" }} bg="#36EEE0" onClick={onOpen}>
        <AddIcon />
      </Circle>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create To do</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
          <TodoForm
            name="Todo"
            submitText="Create Todo"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateTodo}
            // initialValues={{ id: session.userId }}
            onSubmit={async (values) => {
              console.log("values", values)
              try {
                const newTodo = await createTodoMutation(values)
                cookie.set(
                  "state",
                  JSON.stringify({
                    ...arrayColumns,
                    columns: {
                      ...arrayColumns.columns,
                      start: {
                        ...arrayColumns.columns.start,
                        taskIds: [...arrayColumns.columns.start.taskIds, newTodo],
                      },
                    },
                  })
                )

                // Router.reload()
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
          <ModalFooter>
            <Button bgColor="#F652A0" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default CardBottom
