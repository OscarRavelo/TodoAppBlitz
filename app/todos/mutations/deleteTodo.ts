import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteTodo = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteTodo), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const todo = await db.todo.deleteMany({ where: { id } })

  return todo
})
