import { resolver, NotFoundError, Ctx } from "blitz"
import db from "db"
import * as z from "zod"

const GetTodo = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
  // This accepts type of undefined, but is required at runtime
})
export default resolver.pipe(resolver.zod(GetTodo), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  //console.log("userid", userId)
  const todo = await db.todo.findMany({ where: { userId: id } })
  if (!todo) throw new NotFoundError()

  return todo
})
