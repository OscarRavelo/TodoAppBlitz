import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTodo from "app/todos/queries/getTodo"
import deleteTodo from "app/todos/mutations/deleteTodo"

export const Todo = () => {
  const router = useRouter()
  const todoId = useParam("todoId", "number")
  const [deleteTodoMutation] = useMutation(deleteTodo)
  const [todo] = useQuery(getTodo, {})

  return (
    <>
      <Head>
        <title>Todo {todo.id}</title>
      </Head>

      <div>
        <h1>Todo {todo.id}</h1>
        <pre>{JSON.stringify(todo, null, 2)}</pre>

        <Link href={Routes.EditTodoPage({ todoId: todo.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTodoMutation({ id: todo.id })
              router.push(Routes.TodosPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTodoPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TodosPage()}>
          <a>Todos</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Todo />
      </Suspense>
    </div>
  )
}

ShowTodoPage.authenticate = true
ShowTodoPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTodoPage
