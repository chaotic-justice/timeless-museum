import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"

const Header = () => {
  const { data: session } = useSession()
  console.log("data", session)
  const router = useRouter()

  function isActive(pathname: string) {
    return router.pathname === pathname
  }

  const loginFlow = async () => {
    await signIn()
  }

  return (
    <nav>
      <div className="left">
        <Link href="/" legacyBehavior>
          <a className="bold" data-active={isActive("/")}>
            Blog
          </a>
        </Link>
        <Link href="/drafts" legacyBehavior>
          <a data-active={isActive("/drafts")}>Drafts</a>
        </Link>
      </div>
      <div className="right">
        <button onClick={loginFlow}>signup</button>
        {/* <Link href="/signup" legacyBehavior> */}
        {/* <a data-active={isActive("/signup")}>Signup</a> */}
        {/* </Link> */}
        <Link href="/create" legacyBehavior>
          <a data-active={isActive("/create")}>+ Create draft</a>
        </Link>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }

        .right {
          margin-left: auto;
        }

        .right a {
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }
      `}</style>
    </nav>
  )
}

export default Header
