import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useSession, Router, dynamic } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
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

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()

  if (currentUser) {
    return (
      <>
        <Todo id={currentUser.id} />
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
  const [createTodoMutation] = useMutation(createTodo)
  const [todos] = useQuery(getTodo, { id })
  const [updateCompletedTodo] = useMutation(updateComplete)
  const [deleteTodoDone] = useMutation(deleteTodo)
  const [logoutMutation] = useMutation(logout)

  return (
    <>
      {todos.map((todo) => {
        return (
          <Box maxW="sm" color="white">
            <Center width="100%" h="100%">
              <Box bgColor="#4C5270">
                <Grid
                  h="150px"
                  templateRows="repeat(2, 1fr)"
                  templateColumns="repeat(5, 1fr)"
                  gap={2}
                >
                  <GridItem colSpan={4}>
                    {todo.completed ? (
                      <Heading as="del">{todo.name}</Heading>
                    ) : (
                      <Heading>{todo.name}</Heading>
                    )}
                  </GridItem>
                  <GridItem rowSpan={2}>
                    <EditTodoForm todo={todo} />
                  </GridItem>

                  <GridItem colSpan={4}>{todo.information}</GridItem>

                  {/* <Button
                  onClick={() => {
                    deleteTodoDone({ id: todo.id })
                    Router.reload()
                  }}
                  colorScheme="pink"
                  variant="solid"
                >
                  Delete
                </Button> */}
                </Grid>
              </Box>
            </Center>
          </Box>
        )
      })}

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
            await createTodoMutation(values)
            Router.reload()
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </>
  )
}

const Home: BlitzPage = () => {
  //const [todo] = useQuery(getTodo, {})

  return (
    <Container p={[0, 0]} maxW="100vw" h="100vh" bgColor="#BCECE0">
      <Container
        p={[0, 0]}
        bgPosition="50% 70%"
        bgColor="white"
        bgRepeat="no-repeat"
        // bgImage="url('https://images.unsplash.com/photo-1617818393409-d228534eec01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2055&q=80')"
        h="30%"
        maxW="100vw"
      >
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
            <Avatar size="2xl" name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          </Center>
        </Box>
      </Container>
      <Center h="70%">
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
          <Box bgPosition="50% 70%" bgRepeat="no-repeat" w="100%" h="20%">
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
          <Suspense fallback={<h1>loading...</h1>}>
            <UserInfo />
          </Suspense>
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
