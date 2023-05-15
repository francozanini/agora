import {useAuth, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {useState} from "react";
import {systemTheme, cn} from "../utils/css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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

function ThemeButton() {
  const sunIcon = (
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
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );

  const moonIcon = (
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
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );

  const systemIcon = (
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
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  );

  const options = [
    {name: "Light", icon: sunIcon},
    {name: "Dark", icon: moonIcon},
    {name: "System", icon: systemIcon},
  ] as const;

  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme") || systemTheme(),
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-block focus:outline-none">
          <span className="inline-block align-middle text-sky-500">
            {theme === "light" && sunIcon}
            {theme === "dark" && moonIcon}
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="dark:highlight-white/5 flex h-auto  w-auto flex-col rounded-lg bg-white font-semibold ring-1 dark:bg-slate-800 dark:text-white dark:ring-0">
          {options.map(option => (
            <DropdownMenu.Item
              key={option.name}
              className="inline-block py-1 px-4 hover:cursor-pointer hover:bg-slate-100 hover:outline-none hover:dark:bg-gray-700"
              onClick={() => {
                console.log(theme, option.name);
                const newTheme = option.name.toLowerCase();
                if (newTheme === "system") {
                  localStorage.removeItem("theme");
                } else {
                  localStorage.setItem("theme", newTheme);
                  if (newTheme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                }
                setTheme(newTheme);
              }}>
              <span
                className={cn(
                  "mr-2 inline-block align-middle",
                  option.name.toLowerCase() === theme && "text-sky-500",
                )}>
                {option.icon}
              </span>
              <span className="inline-block align-middle">{option.name}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default function Navbar() {
  const {isSignedIn} = useAuth();
  return (
    <nav className="flex justify-between border-b border-slate-900/10 bg-white px-4 py-4 dark:bg-gray-900">
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
        <ThemeButton />
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
                    width: "2rem",
                    height: "2rem",
                  },
                },
              }}
            />
          </>
        )}
      </div>
    </nav>
  );
}
