import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

//i have to specificyes asjlkhdklahskljdhaskl de propertyes in the DATATA AKHBSKDHAKSHDE
const UpdateTodo = z
  .object({
    id: z.number(),
    data: z.object({
      id: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
      name: z.string(),
      information: z.string().optional().nullable(),
      completed: z.boolean(),
      userId: z.number(),
    }),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateTodo),
  resolver.authorize(),
  async ({ id, data }) => {
    const todo = await db.todo.update({
      where: { id },
      data: { ...data, completed: !data.completed },
    })
    console.log("todo", todo)
    return todo

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  }
)
