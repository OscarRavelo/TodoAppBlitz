import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Center, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import React from "react"
import EditTodoForm from "./EditTodoForm"
import { Draggable } from "react-beautiful-dnd"
import { useMutation } from "blitz"
import deleteTodo from "../mutations/deleteTodo"

const CardComponent = ({
  random,
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
    <Box marginBottom="1rem" key={todo.id} shadow="lg" paddingTop={{ base: "10px", lg: "25px" }}>
      <Draggable draggableId={`id: ${todo.id}`} key={todo.id} index={index}>
        {(provided, snapshot) => (
          <Box
            color={letterColor}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Center width="100%" h="100%">
              <Box
                shadow="lg"
                minW={{ base: "95%", lg: "90%" }}
                maxW={{ base: "95%", lg: "90%" }}
                bgColor={cardColor}
                transform={random}
              >
                <Grid
                  height={{ base: "80px", lg: "150px" }}
                  templateRows="repeat(3, 1fr)"
                  templateColumns={{
                    base: "repeat(4, 30px)",
                    lg: "repeat(5,minmax(21px, 1fr))",
                  }}
                  gap={2}
                >
                  <GridItem colSpan={{ base: 3, lg: 4 }}>
                    {todo.completed ? (
                      <Center w="100%" h="100%">
                        <Heading
                          letterSpacing="4px"
                          fontSize="1rem"
                          fontFamily="'Gochi Hand', cursive"
                          as="del"
                        >
                          {todo.name}
                        </Heading>
                      </Center>
                    ) : (
                      <Center paddingTop="15px" w="100%" h="100%">
                        <Heading
                          isTruncated
                          paddingTop="1rem"
                          fontSize={{ base: "15px", lg: "15px" }}
                          textAlign="center"
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

                  <GridItem rowSpan={{ base: 1, lg: 3 }} colSpan={{ base: 3, lg: 4 }}>
                    <Center w="100%" paddingLeft="2rem">
                      <Text isTruncated noOfLines={1} textAlign="center">
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
