import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {ComponentChildren} from "../pages";
import Navbar from "./navbar";
import {capitalized} from "../utils/strings";

function Breadcrumbs() {
  const router = useRouter();

  function generateBreadcrumbs() {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0];

    if (!asPathWithoutQuery) throw new Error("Breadcrumbs can not use router");

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery
      .split("/")
      .filter(v => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      const text = decodeURI(subpath).replaceAll("-", " ");
      return {href, text};
    });

    // Add in a default "Home" crumb for the top-level
    return [{href: "/", text: "Home"}, ...crumblist.slice(1)];
  }

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    <ul>
      {breadcrumbs.map((crumb, index) => (
        <>
          <li className="inline-block" key={crumb.href}>
            {index === 0 ? (
              <span className="mr-2 inline-block align-middle">
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
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </span>
            ) : null}
            <Link
              href={crumb.href}
              className="inline-block align-middle hover:underline">
              {capitalized(crumb.text)}
            </Link>
          </li>
          {index < breadcrumbs.length - 1 ? (
            <span className="inline-block align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : null}
        </>
      ))}
    </ul>
  );
}

export default function Layout({children}: {children: ComponentChildren}) {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="relative min-h-screen">
      <div className="relative">
        <Navbar />
        <div className="py-6 px-6">
          <div className="flex flex-row justify-between">
            <Breadcrumbs />
            <button className="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <main className="mt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
