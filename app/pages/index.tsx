import { Suspense, useState } from "react"
import { BlitzPage, useQuery, useMutation, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { DragDropContext } from "react-beautiful-dnd"
import { Container, Center, Box, Flex, Text, Image, Button } from "@chakra-ui/react"
import React from "react"
import getTodo from "app/todos/queries/getTodo"
import Cookies from "universal-cookie"
import TodoColumn from "app/todos/components/TodoColumn"
import CardBottom from "app/todos/components/CardBottom"
import logout from "app/auth/mutations/logout"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */
const UserInfo = () => {
  const router = useRouter()
  const cookie = new Cookies()
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
    cookie.remove("state")
    router.push("/login")

    return <h1>loading</h1>
  }
}

const Todo = ({ id }) => {
  //states

  const cookie = new Cookies()
  const [arrayColumns, setArrayColumns] = useState({ ...cookie.get("state") })
  const [todos] = useQuery(getTodo, { id })

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
      console.log("cookie created")
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
        setArrayColumns({ ...JSON.parse(test.value) })
      })
    }
  }
  setCookies()

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
    }
  }

  //before render

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box h="100%" w="100%">
        <Flex
          fontSize={{ base: "10px" }}
          h="100%"
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <TodoColumn
            columnHeader="NOT STARTED"
            cardColor="#36EEE0"
            cardLetter="#4C5270"
            bgaColorColumn="rgba(54,338,224, 0.5)"
            arrayColumns={arrayColumns}
            columnName="start"
            handleDelete={handleDelete}
            cookie={cookie}
          />
          <TodoColumn
            columnHeader="IN PROGRESS"
            bgaColorColumn="rgba(188,236,224, 0.5)"
            cardColor="#BCECE0"
            cardLetter="#4C5270"
            arrayColumns={arrayColumns}
            columnName="progress"
            handleDelete={handleDelete}
            cookie={cookie}
          />

          <TodoColumn
            columnHeader="COMPLETE"
            cardColor="#F652A0"
            cardLetter="#4C5270"
            bgaColorColumn="rgba(246,82,160,0.5)"
            arrayColumns={arrayColumns}
            columnName="completed"
            handleDelete={handleDelete}
            cookie={cookie}
          />
        </Flex>
      </Box>
      <Box w="100%" h="8%">
        <CardBottom arrayColumns={arrayColumns} cookie={cookie} />
      </Box>
    </DragDropContext>
  )
}

const Home: BlitzPage = () => {
  const [logoutMutation] = useMutation(logout)
  const deletedCookie = new Cookies()
  const router = useRouter()

  //const [todo] = useQuery(getTodo, {})

  return (
    <Container fontSize={{ base: "10px" }} p={[0, 0]} maxW="100vw" h="100vh">
      <img
        style={{
          position: "absolute",
          objectFit: "cover",
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
        <Container
          p={[0, 0]}
          h="32%"
          maxW="100vw"
          bgGradient="linear-gradient(to right, #bcece0 1%,#36eee0 100%)"
          shadow="lg"
        >
          <Flex justifyContent="flex-end" paddingRight="7px" paddingTop="7px">
            <Button
              bg="#BCECE0"
              onClick={async () => {
                deletedCookie.remove("state")

                router.push("/login")
                logoutMutation()
              }}
            >
              Log Out
            </Button>
          </Flex>
          <Box w={{ base: "100%", lg: "20%" }} h={{ base: "0%", lg: "100%" }}>
            <Center h="90%">
              <Image
                position={{ base: "relative" }}
                top={{ base: "-2" }}
                border="3px solid white"
                borderRadius="full"
                boxSize={{ base: "70px", lg: "150px" }}
                src="https://media.discordapp.net/attachments/461329312943964160/839173207612194886/cat_icon.jpg"
                alt="Cat Profile"
              />
            </Center>
          </Box>
        </Container>

        <Center>
          <Box
            top="20"
            position="absolute"
            w="60%"
            h={{ base: "75%", lg: "80%" }}
            minW="300px"
            borderRadius="lg"
            overflow="hidden"
            shadow="lg"
          >
            <img
              style={{
                opacity: "0.98",
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
                h={{ base: "10%", lg: "20%" }}
                zIndex="2"
                position="relative"
                borderBottom="2px solid rgba(188, 236, 224, .5)"
              >
                <Center h="100%">
                  <Text
                    letterSpacing="4px"
                    fontFamily="'Gochi Hand', cursive"
                    fontSize="3.5em"
                    fontWeight="extrabold"
                    color="#4C5270"
                    h="1.5em"
                    borderBottom="10px solid #4C5270"
                  >
                    TO DO LIST
                  </Text>
                </Center>
              </Box>
              <Box maxW="100%" h={{ base: "85%", lg: "74%" }}>
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
