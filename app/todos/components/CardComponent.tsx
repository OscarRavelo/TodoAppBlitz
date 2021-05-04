import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Center, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import React from "react"
import EditTodoForm from "./EditTodoForm"
import { Draggable } from "react-beautiful-dnd"
import { useMutation } from "blitz"
import deleteTodo from "../mutations/deleteTodo"

const CardComponent = ({
  todo,
  cookie,
  arrayColumns,
  handleDelete,
  index,
  cardColor,
  letterColor,
}) => {
  const [deleteTodoDone] = useMutation(deleteTodo)

  return (
    <Box marginBottom="1rem" key={todo.id} shadow="lg">
      <Draggable draggableId={`id: ${todo.id}`} key={todo.id} index={index}>
        {(provided, snapshot) => (
          <Box
            color={letterColor}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Center width="100%" h="100%">
              <Box minH="100%" minW="100%" bgColor={cardColor} borderRadius="lg">
                <Grid
                  height="150px"
                  templateRows="repeat(3, 1fr)"
                  templateColumns="repeat(5,minmax(41px, 1fr))"
                  gap={2}
                >
                  <GridItem colSpan={4}>
                    {todo.completed ? (
                      <Center w="100%" h="100%">
                        <Heading
                          fontSize="1.3rem"
                          letterSpacing="4px"
                          fontFamily="'Gochi Hand', cursive"
                          as="del"
                        >
                          {todo.name}
                        </Heading>
                      </Center>
                    ) : (
                      <Center w="100%" h="100%">
                        <Heading
                          paddingTop="1rem"
                          textAlign="center"
                          fontSize="1.3rem"
                          letterSpacing="4px"
                          fontFamily="'Gochi Hand', cursive"
                        >
                          {todo.name}
                        </Heading>
                      </Center>
                    )}
                  </GridItem>
                  <GridItem rowSpan={3}>
                    <Box
                      w="100%"
                      h="100%"
                      d="flex"
                      justifyContent="space-between"
                      flexDirection="column"
                    >
                      <EditTodoForm arrayColumns={arrayColumns} cookie={cookie} todo={todo} />
                      <Box
                        _hover={{ cursor: "pointer" }}
                        d="flex"
                        justifyContent="flex-end"
                        paddingBottom="7px"
                        paddingRight="6px"
                      >
                        <DeleteIcon
                          w={5}
                          h={5}
                          o
                          onClick={async () => {
                            const deletedTodo = await deleteTodoDone({
                              id: todo.id,
                            })
                            //Router.reload()
                            handleDelete(deletedTodo)
                          }}
                        />
                      </Box>
                    </Box>
                  </GridItem>

                  <GridItem rowSpan={3} colSpan={4}>
                    <Center w="100%" paddingLeft="2rem">
                      <Text isTruncated noOfLines={[1, 2, 3]} textAlign="center">
                        {todo.information}
                      </Text>
                    </Center>
                  </GridItem>
                </Grid>
              </Box>
            </Center>
          </Box>
        )}
      </Draggable>
    </Box>
  )
}
export default CardComponent
