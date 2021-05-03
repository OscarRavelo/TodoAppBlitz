import { Suspense, useState } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useSession, Router, dynamic } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import logout from "app/auth/mutations/logout"
import {
  Container,
  Icon,
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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */
const UserInfo = () => {
  const currentUser = useCurrentUser()
  if (currentUser) {
    return (
      <>
        <Box h="100%">
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
        //console.log("test.value.json()", JSON.parse(test.value))
        setArrayColumns({ ...JSON.parse(test.value) })
      })
    }
  }
  setCookies()

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
    const movedItem = startTaskIds.splice(result.source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    if (!finish.taskIds.some((item) => item.id === parseInt(result.draggableId))) {
      console.log(
        "tessssss",
        !finish.taskIds.some((item) => item.id === parseInt(result.draggableId))
      )
      console.log("finish taskids", finish.taskIds)
      const finishTaskIds = Array.from(finish.taskIds)

      finishTaskIds.splice(result.destination.index, 0, ...movedItem)
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
      <Box h="100%" w="100%">
        <Flex h="100%" w="100%">
          <Box
            flex="1"
            borderRight="2px solid rgba(188, 236, 224, .5)"
            padding="1rem"
            overflow="hidden"
          >
            <Center>
              <Box marginBottom=".5rem">
                <Heading letterSpacing="4px" fontFamily="'Gochi Hand', cursive" color="#4C5270">
                  START
                </Heading>
              </Box>
            </Center>
            <Droppable droppableId="start" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    height: "100%",
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(54, 238, 224, 0.5)"
                      : "rgba(188, 236, 224, 0)",
                  }}
                >
                  {arrayColumns.columns.start.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={`id: ${todo.id}`} key={todo.id} drag index={index}>
                          {(provided, snapshot) => (
                            <Box
                              color="white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box minH="100%" minW="100%" bgColor="#36EEE0" borderRadius="lg">
                                  <Grid
                                    height="150px"
                                    templateRows="repeat(3, 1fr)"
                                    templateColumns="repeat(5,minmax(41px, 1fr))"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center h="100%">
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
                                        <Center h="100%">
                                          <Heading
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
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
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
                                      <Center p="2px">
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
                    ) // todos array
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Box>
          <Box
            flex="1"
            borderRight="2px solid rgba(188, 236, 224, .5)"
            padding="1rem"
            overflow="hidden"
          >
            <Center>
              <Heading
                letterSpacing="4px"
                fontFamily="'Gochi Hand', cursive"
                color="#4C5270"
                marginBottom=".5rem"
              >
                PROGRESS
              </Heading>
            </Center>
            <Droppable droppableId="progress" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    height: "100%",
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(188, 236, 224, .5)"
                      : "rgba(188, 236, 224, 0)",
                  }}
                >
                  {arrayColumns.columns.progress.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={`id: ${todo.id}`} key={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              color="#4C5270"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box minH="100%" minW="100%" bgColor="#BCECE0" borderRadius="lg">
                                  <Grid
                                    height="150px"
                                    templateRows="repeat(3, 1fr)"
                                    templateColumns="repeat(5,minmax(41px, 1fr))"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center h="100%">
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
                                        <Center h="100%">
                                          <Heading
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
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
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
                                      <Center p="2px">
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
                    ) // todos array
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Box>
          <Box
            flex="1"
            borderRight="2px solid rgba(188, 236, 224, .5)"
            padding="1rem"
            overflow="hidden"
          >
            <Center>
              <Heading
                letterSpacing="4px"
                fontFamily="'Gochi Hand', cursive"
                color="#4C5270"
                marginBottom=".5rem"
              >
                COMPLETED
              </Heading>
            </Center>
            <Droppable droppableId="completed" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    height: "100%",
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(246, 82, 160, .5)"
                      : "rgba(188, 236, 224, 0)",
                  }}
                >
                  {/* {todo here} */}
                  {arrayColumns.columns.completed.taskIds.map((todo, index) => {
                    return (
                      <Box marginBottom="1rem" key={todo.id}>
                        <Draggable draggableId={`id: ${todo.id}`} key={todo.id} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              color="white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Center width="100%" h="100%">
                                <Box minH="100%" minW="100%" bgColor="#F652A0" borderRadius="lg">
                                  <Grid
                                    height="150px"
                                    templateRows="repeat(3, 1fr)"
                                    templateColumns="repeat(5,minmax(41px, 1fr))"
                                    gap={2}
                                  >
                                    <GridItem colSpan={4}>
                                      {todo.completed ? (
                                        <Center h="100%">
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
                                        <Center h="100%">
                                          <Heading
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
                                        <EditTodoForm
                                          arrayColumns={arrayColumns}
                                          cookie={cookie}
                                          todo={todo}
                                        />
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
                                      <Center p="2px">
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
                  })}
                  {provided.placeholder}
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

            // Router.reload()
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
    <Container p={[0, 0]} maxW="100vw" h="100vh">
      <img
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "100%",
          height: "100%",
        }}
        src="https://media.discordapp.net/attachments/461329312943964160/838853029137612800/taustalogo_mint.jpg"
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
        <Container p={[0, 0]} h="25.6%" maxW="100vw" bgColor="#36EEE0" shadow="lg">
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
          <Box top="20" position="absolute" w="60%" h="80%" minW="300px" rounded="md" shadow="lg">
            <img
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "100%",
                height: "100%",
              }}
              src="https://media.discordapp.net/attachments/461329312943964160/838853770620174396/vector-notepad-2111645_1280.png"
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
              <Box
                w="100%"
                h="20%"
                zIndex="2"
                position="relative"
                borderBottom="2px solid rgba(188, 236, 224, .5)"
              >
                <Center h="100%">
                  <Text
                    letterSpacing="4px"
                    fontFamily="'Gochi Hand', cursive"
                    fontSize="4.5rem"
                    fontWeight="extrabold"
                    color="#4C5270"
                    h="5.5rem"
                    borderBottom="10px solid #4C5270"
                  >
                    TO DO LIST
                  </Text>
                </Center>
              </Box>
              <Box maxW="100%" h="80%">
                <Suspense fallback={<h1>Loading...</h1>}>
                  <UserInfo />
                </Suspense>
              </Box>
            </div>
          </Box>
        </Center>
      </div>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
function logoutMutation() {
  throw new Error("Function not implemented.")
}
