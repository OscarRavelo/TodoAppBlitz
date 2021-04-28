import { Ctx, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateTodo = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateTodo),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId!
    const todo = await db.todo.create({ data: { name: input.name, userId: userId } })

    return todo
  }
)
