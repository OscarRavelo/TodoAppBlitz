import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes, useQuery, useSession, Router, dynamic } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { Container, Center, Box, Flex, Text, Heading, Checkbox, Button } from "@chakra-ui/react"
import React from "react"
import { TodoForm, FORM_ERROR } from "app/todos/components/TodoForm"
import createTodo from "app/todos/mutations/createTodo"
import getTodo from "app/todos/queries/getTodo"
import updateComplete from "app/todos/mutations/updateComplete"
import EditTodoForm from "app/todos/components/EditTodoForm"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User role: <code>{currentUser.role}</code>
        </div>
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

const Todo = () => {
  const session = useSession()
  const [todos] = useQuery(getTodo, { id: session.userId! })
  const [updateCompletedTodo] = useMutation(updateComplete)

  return (
    <>
      <Container
        p={[0, 0]}
        d="flex"
        flexDirection="column"
        justifyContent="space-around"
        marginBottom="6px"
        maxH="100%"
        maxW="100%"
      >
        {todos.map((todo) => {
          return (
            <Box bg="black" d="flex" justifyContent="space-between" shadow="lg" marginBottom="6px">
              <Checkbox
                defaultChecked={todo.completed}
                todoName={todo.name}
                todoId={todo.id}
                onChange={async () => {
                  await updateCompletedTodo({ data: { ...todo }, id: todo.id })
                  Router.reload()
                }}
                marginRight="5px"
                isInvalid
              >
                Done
              </Checkbox>
              {todo.completed ? <Text as="del">{todo.name}</Text> : <Text>{todo.name}</Text>}
              <EditTodoForm todo={todo} />
              <Button colorScheme="pink" variant="solid">
                Delete
              </Button>
            </Box>
          )
        })}
      </Container>
    </>
  )
}

const Home: BlitzPage = () => {
  const [createTodoMutation] = useMutation(createTodo)
  //const [todo] = useQuery(getTodo, {})
  return (
    <Container p={[0, 0]} maxW="100vw" h="100vh" bgGradient="linear(to-r,  #41295a, #2F0743)">
      <Container
        p={[0, 0]}
        bgPosition="50% 70%"
        bgRepeat="no-repeat"
        bgImage="url('https://images.unsplash.com/photo-1617818393409-d228534eec01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2055&q=80')"
        h="25%"
        maxW="100vw"
      >
        <Box bgGradient="linear(to-r, green.200, pink.500)" w="100%" h="100%" opacity="0.4"></Box>
      </Container>
      <Center h="70vh">
        <Box
          overflow="hidden"
          top="20"
          position="absolute"
          bgGradient="linear-gradient(to-r, #a8ff78,#78ffd6)"
          shadow=""
          w="30%"
          h="70%"
          minW="300px"
          boxShadow="dark-lg"
          rounded="md"
        >
          <Flex direction="column" color="white">
            <Box
              boxShadow="dark-lg"
              borderBottom="1px solid black"
              bgPosition="50% 70%"
              bgRepeat="no-repeat"
              bgImage="url('https://images.unsplash.com/photo-1617818393409-d228534eec01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2055&q=80')"
              w="100%"
              h="15vh"
            >
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
            <Box bgGradient="linear-gradient(to-r, #c0c0aa, #1cefff)" w="100%" h="100vh">
              <Box borderBottom="1px solid green">
                <Suspense fallback={<h1>loading</h1>}>
                  <Todo />
                </Suspense>
              </Box>
              <Box>
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
              </Box>
              <Box>
                <Suspense fallback={<h1>loading...</h1>}>
                  <UserInfo />
                </Suspense>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Center>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
