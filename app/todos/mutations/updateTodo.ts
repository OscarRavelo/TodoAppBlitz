import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateTodo = z
  .object({
    id: z.number(),
    name: z.string(),
    information: z.string().optional().nullable(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateTodo),
  resolver.authorize(),
  async ({ id, name, information }) => {
    const todo = await db.todo.update({ where: { id }, data: { name, information } })
    console.log("updatedTodo", todo)
    return todo
  }
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
)
