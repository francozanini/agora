import {useAuth, UserButton} from '@clerk/nextjs';
import Link from 'next/link';

function AuthButtons() {
  return (
    <>
      <Link href="/sign-in/" className="inline-block">
        <span className="inline-block align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </span>
        <span className="inline-block align-middle font-semibold hover:underline">
          Register
        </span>
      </Link>
      <div className="inline-block">
        <span className="inline-block align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
            />
          </svg>
        </span>
        <span className="inline-block align-middle font-semibold hover:underline">
          Login
        </span>
      </div>
    </>
  );
}

export function Navbar() {
  const {isSignedIn} = useAuth();
  return (
    <nav className="flex w-full justify-between">
      <button className="h-4 w-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="flex flex-row gap-4">
        {!isSignedIn ? (
          <AuthButtons />
        ) : (
          <>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '2rem',
                    height: '2rem'
                  }
                }
              }}
            />
          </>
        )}
      </div>
    </nav>
  );
}
