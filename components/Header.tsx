import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"

const Header = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  function isActive(pathname: string) {
    return router.pathname === pathname
  }

  return (
    <nav>
      <div className="left">
        <Link href="/" legacyBehavior shallow={true}>
          <a className="bold" data-active={isActive("/")}>
            wall
          </a>
        </Link>
        <Link href="/drafts" legacyBehavior>
          <a data-active={isActive("/drafts")}>archived</a>
        </Link>
      </div>
      <div className="right">
        {status === "authenticated" ? (
          <a href="#">
            <button onClick={() => signOut()}>logout</button>
          </a>
        ) : (
          <a href="/api/auth/signin">
            <button onClick={() => signIn()}>login</button>
          </a>
        )}
        <Link href="/upload-image" legacyBehavior>
          <a data-active={isActive("/upload-image")}>+ upload photo</a>
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
