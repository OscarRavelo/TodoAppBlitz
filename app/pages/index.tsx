import { Suspense, useState } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useSession, Router, dynamic } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import logout from "app/auth/mutations/logout"
import {
  Container,
  Center,
  Box,
  Flex,
  Text,
  Checkbox,
  Button,
  Avatar,
  Heading,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import React from "react"
import { TodoForm, FORM_ERROR } from "app/todos/components/TodoForm"
import createTodo from "app/todos/mutations/createTodo"
import getTodo from "app/todos/queries/getTodo"
import updateComplete from "app/todos/mutations/updateComplete"
import EditTodoForm from "app/todos/components/EditTodoForm"
import deleteTodo from "app/todos/mutations/deleteTodo"
import Cookies from "universal-cookie"
import previewEmail from "preview-email"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */
const UserInfo = () => {
  const currentUser = useCurrentUser()
  if (currentUser) {
    return (
      <>
        <Box h="100%" border="1px solid black">
          <Todo id={currentUser.id} />
        </Box>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Todo = ({ id }) => {
  //states
  const [todos] = useQuery(getTodo, { id })
  const cookie = new Cookies()
  const [arrayTodoList, setArrayTodoList] = useState(todos)
  const [arrayColumns, setArrayColumns] = useState({ ...cookie.get("state") })

  function handleDelete(item) {
    const startTaskIds = [...arrayColumns.columns.start.taskIds]
    const progressTaskIds = [...arrayColumns.columns.progress.taskIds]
    const completedTaskIds = [...arrayColumns.columns.completed.taskIds]

    //checking start
    if (startTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      const filteredArray = startTaskIds.filter((list) => list.id !== item.id)
      cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            start: {
              ...arrayColumns.columns.start,
              taskIds: [...filteredArray],
            },
          },
        })
      )
    } else if (progressTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      const filteredArray = progressTaskIds.filter((list) => list.id !== item.id)
      cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            progress: {
              ...arrayColumns.columns.progress,
              taskIds: [...filteredArray],
            },
          },
        })
      )
    } else if (completedTaskIds.find((predicate) => predicate.id === item.id) !== undefined) {
      const filteredArray = completedTaskIds.filter((list) => list.id !== item.id)
      cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: {
            ...arrayColumns.columns,
            completed: {
              ...arrayColumns.columns.completed,
              taskIds: [...filteredArray],
            },
          },
        })
      )
    }

    //checking progress

    //checking completed
  }

  //cookies
  //cookies
  function setCookies() {
    if (!cookie.get("state")) {
      console.log("heyyyyyy")
      return cookie.set(
        "state",
        JSON.stringify({
          tasks: [...todos],
          columns: {
            start: {
              id: "start",
              title: "start",
              taskIds: [...todos],
            },
            progress: {
              id: "progress",
              title: "pogress",
              taskIds: [],
            },
            completed: {
              id: "completed",
              title: "completed",
              taskIds: [],
            },
          },
          columnOrder: ["start", "progress", "completed"],
        }),
        { path: "/" }
      )
    } else {
      cookie.addChangeListener((test) => {
        console.log("test.value.json()", JSON.parse(test.value))
        setArrayColumns({ ...JSON.parse(test.value) })
      })
    }
  }
  setCookies()

  function handleRepetitive() {}

  const [createTodoMutation] = useMutation(createTodo)
  const [currentPosition, setCurrentPosition] = useState(["start", "progress", "completed"])
  const [currentDestination, setCurrentDestination] = useState("")
  const [updateCompletedTodo] = useMutation(updateComplete)
  const [deleteTodoDone] = useMutation(deleteTodo)
  const [logoutMutation] = useMutation(logout)

  function handleOnDragEnd(result) {
    if (!result.destination) {
      return
    }
    const start = arrayColumns.columns[result.source.droppableId]
    const finish = arrayColumns.columns[result.destination.droppableId]
    const items = Array.from(arrayTodoList)
    const itemToChange = items.filter((a) => a.name === result.draggableId)
    const itemsState = Array.from(arrayColumns.columns[result.destination.droppableId].taskIds)

    if (start === finish) {
      const [reorderedItem] = start.taskIds.splice(result.source.index, 1)
      start.taskIds.splice(result.destination.index, 0, reorderedItem)
      const newColumn = {
        ...start,
        taskIds: start.taskIds,
      }

      return cookie.set(
        "state",
        JSON.stringify({
          ...arrayColumns,
          columns: { ...arrayColumns.columns, [newColumn.id]: newColumn },
        })
      )
    }
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(result.source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    if (!finish.taskIds.some((item) => item.id === itemToChange[0].id)) {
      console.log("tessssss")
      const finishTaskIds = Array.from(finish.taskIds)

      finishTaskIds.splice(
        result.destination.index,
        0,
        ...items.filter((a) => a.name === result.draggableId)
      )
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      }

      const newState = {
        ...arrayColumns,
        columns: {
          ...arrayColumns.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      }

      return cookie.set("state", JSON.stringify(newState))
    } else {
      console.log("bug comming!")
    }
  }

  //before render

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box h="100%">
        <Flex h="100%">
          <Box flex="1" borderRight="2px solid rgba(188, 236, 224, .5)" padding="1rem">
            <Center>
              <Heading marginBottom=".5rem">Completed</Heading>
            </Center>
            <Droppable droppableId="completed" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "rgba(188, 236, 224, .5)" : "white",
                  }}
                >
                  {arrayColumns.columns.completed.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={todo.name} key={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              maxW="sm"
                              color="white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box bgColor="#36EEE0" borderRadius="lg">
                                  <Grid
                                    h="150px"
                                    templateRows="repeat(2, 1fr)"
                                    templateColumns="repeat(5, 1fr)"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center>
                                          <Heading as="del">{todo.name}</Heading>
                                        </Center>
                                      ) : (
                                        <Center>
                                          <Heading>{todo.name}</Heading>
                                        </Center>
                                      )}
                                    </GridItem>
                                    <GridItem rowSpan={2}>
                                      <Box
                                        w="100%"
                                        h="100%"
                                        d="flex"
                                        justifyContent="space-between"
                                        flexDirection="column"
                                      >
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
                                        <Button
                                          onClick={async () => {
                                            const deletedTodo = await deleteTodoDone({
                                              id: todo.id,
                                            })
                                            //Router.reload()
                                            handleDelete(deletedTodo)
                                          }}
                                          colorScheme="pink"
                                          variant="solid"
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                    </GridItem>

                                    <GridItem colSpan={4}>
                                      <Center>{todo.information} </Center>
                                    </GridItem>
                                  </Grid>
                                </Box>
                              </Center>
                            </Box>
                          )}
                        </Draggable>
                      </Box>
                    ) // todos array
                  })}
                </div>
              )}
            </Droppable>
          </Box>
          <Box flex="1" borderRight="2px solid rgba(188, 236, 224, .5)" padding="1rem">
            <Center>
              <Heading marginBottom=".5rem">Progress</Heading>
            </Center>
            <Droppable droppableId="progress" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "rgba(188, 236, 224, .5)" : "white",
                  }}
                >
                  {arrayColumns.columns.progress.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={todo.name} key={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              maxW="sm"
                              color="white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box bgColor="#BCECE0" borderRadius="lg">
                                  <Grid
                                    h="150px"
                                    templateRows="repeat(2, 1fr)"
                                    templateColumns="repeat(5, 1fr)"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center>
                                          <Heading as="del">{todo.name}</Heading>
                                        </Center>
                                      ) : (
                                        <Center>
                                          <Heading>{todo.name}</Heading>
                                        </Center>
                                      )}
                                    </GridItem>
                                    <GridItem rowSpan={2}>
                                      <Box
                                        w="100%"
                                        h="100%"
                                        d="flex"
                                        justifyContent="space-between"
                                        flexDirection="column"
                                      >
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
                                        <Button
                                          onClick={async () => {
                                            const deletedTodo = await deleteTodoDone({
                                              id: todo.id,
                                            })
                                            //Router.reload()
                                            handleDelete(deletedTodo)
                                          }}
                                          colorScheme="pink"
                                          variant="solid"
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                    </GridItem>

                                    <GridItem colSpan={4}>
                                      <Center>{todo.information} </Center>
                                    </GridItem>
                                  </Grid>
                                </Box>
                              </Center>
                            </Box>
                          )}
                        </Draggable>
                      </Box>
                    ) // todos array
                  })}
                </div>
              )}
            </Droppable>
          </Box>
          <Box flex="1" borderRight="2px solid rgba(188, 236, 224, .5)" padding="1rem">
            <Center>
              <Heading marginBottom=".5rem">Start</Heading>
            </Center>
            <Droppable droppableId="start" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "rgba(188, 236, 224, .5)" : "white",
                  }}
                >
                  {/* {todo here} */}
                  {arrayColumns.columns.start.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={todo.name} key={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              maxW="sm"
                              color="white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box bgColor="#F652A0" borderRadius="lg">
                                  <Grid
                                    h="150px"
                                    templateRows="repeat(2, 1fr)"
                                    templateColumns="repeat(5, 1fr)"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center>
                                          <Heading as="del">{todo.name}</Heading>
                                        </Center>
                                      ) : (
                                        <Center>
                                          <Heading>{todo.name}</Heading>
                                        </Center>
                                      )}
                                    </GridItem>
                                    <GridItem rowSpan={2}>
                                      <Box
                                        w="100%"
                                        h="100%"
                                        d="flex"
                                        justifyContent="space-between"
                                        flexDirection="column"
                                      >
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
                                        {/* correct deleteBotom */}
                                        <Button
                                          onClick={async () => {
                                            const deletedTodo = await deleteTodoDone({
                                              id: todo.id,
                                            })
                                            //Router.reload()
                                            handleDelete(deletedTodo)
                                          }}
                                          colorScheme="pink"
                                          variant="solid"
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                    </GridItem>

                                    <GridItem colSpan={4}>
                                      <Center>{todo.information} </Center>
                                    </GridItem>
                                  </Grid>
                                </Box>
                              </Center>
                            </Box>
                          )}
                        </Draggable>
                      </Box>
                    ) // todos array
                  })}
                  {/* {perfect here} */}
                </div>
              )}
            </Droppable>
          </Box>
        </Flex>
      </Box>
      <TodoForm
        name="Todo"
        submitText="Create Todo"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTodo}
        // initialValues={{ id: session.userId }}
        onSubmit={async (values) => {
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

            Router.reload()
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </DragDropContext>
  )
}

const Home: BlitzPage = () => {
  const [todoList, updateTodoList] = useState({})

  //const [todo] = useQuery(getTodo, {})

  return (
    <Container
      p={[0, 0]}
      maxW="100vw"
      h="100vh"
      bgGradient="linear-gradient(to bottom, white,  #BCECE0)"
    >
      <Container p={[0, 0]} h="25.6%" maxW="100vw" bgColor="white">
        <Box d="flex" justifyContent="flex-end" paddingEnd="1rem">
          <button
            className="button small"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Logout
          </button>
        </Box>
        <Box w="20%" h="100%">
          <Center h="90%">
            <Avatar size="2xl" name="Segun Adebayo" src="https://robohash.org/2/?set=set4" />
          </Center>
        </Box>
      </Container>
      <Center>
        <Box
          border="2px solid black"
          top="20"
          position="absolute"
          bgColor="white"
          w="60%"
          h="80%"
          minW="300px"
          rounded="md"
        >
          <Box w="100%" h="20%" bgColor="white" zIndex="2" position="relative">
            <Center h="100%">
              <Text
                noOfLines={[1, 2, 3]}
                fontSize="2rem"
                fontWeight="extrabold"
                bgClip="text"
                bgGradient="linear-gradient(to-r, #c0c0aa,#B86792)"
              >
                TO DO LIST
              </Text>
            </Center>
          </Box>
          <Box maxW="100%" h="80%">
            <img
              style={{
                opacity: "0.5",
                position: "absolute",
                top: "0",
                right: "0",
                width: "100%",
                height: "100%",
              }}
              src="https://media.discordapp.net/attachments/461329312943964160/838373738529554473/taustalogo.jpg?"
              alt="empty"
            />
            <div
              style={{
                zIndex: 2,
                opacity: "1",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Suspense fallback={<h1>Loading...</h1>}>
                <UserInfo />
              </Suspense>
            </div>
          </Box>
        </Box>
      </Center>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
function logoutMutation() {
  throw new Error("Function not implemented.")
}
