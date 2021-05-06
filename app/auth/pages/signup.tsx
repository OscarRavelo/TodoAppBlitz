import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import React from "react"
import { Box, Center, Container, Flex } from "@chakra-ui/react"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
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
            <Flex justifyContent="flex-end" paddingRight="7px" paddingTop="7px"></Flex>
            <Box w={{ base: "100%", lg: "20%" }} h={{ base: "0%", lg: "100%" }}>
              <Center h="90%"></Center>
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
                src="https://media.discordapp.net/attachments/461329312943964160/839807694495678524/notebook_pink.png"
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
                <Box w="100%" h={{ base: "10%", lg: "20%" }} zIndex="2" position="relative">
                  <Center h="100%"></Center>
                </Box>
                <Box maxW="100%" h={{ base: "85%", lg: "74%" }}>
                  <Flex flexDirection={{ base: "column", lg: "row" }}>
                    <img
                      style={{
                        width: "40%",
                        height: "40%",
                        position: "relative",
                        top: "-30px",
                        left: "25px",
                        zIndex: 2,
                      }}
                      src="https://media.discordapp.net/attachments/461329312943964160/839835540568277013/login_cat_-_Copy_-_kitsyz.png"
                      alt="empty"
                    />

                    <SignupForm onSuccess={() => router.push(Routes.Home())} />
                  </Flex>
                </Box>
              </div>
            </Box>
          </Center>
        </div>
      </Container>
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
