import React from "react"
import { Box, Center, Heading } from "@chakra-ui/react"
import { Droppable } from "react-beautiful-dnd"
import CardComponent from "./CardComponent"

const TodoColumn = ({
  cookie,
  arrayColumns,
  handleDelete,
  columnName,
  cardColor,
  cardLetter,
  bgaColorColumn,
}) => {
  return (
    <Box flex="1" borderRight="2px solid rgba(188, 236, 224, .5)" padding="1rem" overflow="hidden">
      <Center>
        <Box marginBottom=".5rem">
          <Heading
            letterSpacing="4px"
            fontFamily="'Gochi Hand', cursive"
            color="#4C5270"
            position="sticky"
          >
            {columnName}
          </Heading>
        </Box>
      </Center>
      <Droppable droppableId={columnName} type="PERSON">
        {(provided, snapshot) => (
          <Box
            overflow="hidden"
            overflowY="scroll"
            css={{
              "&::-webkit-scrollbar": {
                width: "0px",
              },
              "&::-webkit-scrollbar-track": {
                width: "0px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#4C5270",
                borderRadius: "24px",
              },
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              height: "100%",
              backgroundColor: snapshot.isDraggingOver
                ? `${bgaColorColumn}`
                : "rgba(188, 236, 224, 0)",
            }}
          >
            {arrayColumns.columns[columnName].taskIds.map((todo, index) => {
              const random =
                Math.floor(Math.random() * (10 - 1)) + 1 >= 5
                  ? `rotate(${Math.floor(Math.random() * (6 - 1)) + 2}deg)`
                  : `rotate(-${Math.floor(Math.random() * (6 - 1)) + 2}deg)`
              console.log(random)
              return (
                <CardComponent
                  random={random}
                  cardColor={cardColor}
                  letterColor={cardLetter}
                  arrayColumns={arrayColumns}
                  todo={todo}
                  index={index}
                  handleDelete={handleDelete}
                  cookie={cookie}
                />
              ) // todos array
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  )
}

export default TodoColumn
