import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Heading } from "@chakra-ui/layout"
import React from "react"
import { Box, Center, Text } from "@chakra-ui/react"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <Box>
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <Center>
          <Box w={{ base: "50%", lg: "90%" }}>
            <Box marginBottom="15px">
              <LabeledTextField name="email" label="Email" placeholder="Email" />
            </Box>
            <Box marginBottom="15px">
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </Box>
          </Box>
        </Center>
      </Form>

      <Center>
        <Heading marginTop="8px" fontSize="1rem" zIndex="9" color="black">
          <Link href={Routes.SignupPage()}>Sign Up</Link>
        </Heading>
      </Center>
    </Box>
  )
}

export default LoginForm
