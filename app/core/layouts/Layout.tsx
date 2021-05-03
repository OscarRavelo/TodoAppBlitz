import { ReactNode } from "react"
import { Head } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div style={{ fontFamily: "Lato" }}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Lato&display=swap"
          rel="stylesheet"
        />
        <link key={1} rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          key={2}
          href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap"
          rel="stylesheet"
        />
        <title>{title || "todo-new"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </div>
  )
}

export default Layout
