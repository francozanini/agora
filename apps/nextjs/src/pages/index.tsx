import type {AppRouter} from '@acme/api';
import {useAuth, UserButton} from '@clerk/nextjs';
import type {inferProcedureOutput} from '@trpc/server';
import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {trpc} from '../utils/trpc';
import * as Accordion from '@radix-ui/react-accordion';

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter['post']['all']>[number];
}> = ({post}) => {
  return (
    <div className="max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]">
      <h2 className="text-2xl font-bold text-[hsl(280,100%,70%)]">
        {post.title}
      </h2>
      <p>{post.content}</p>
    </div>
  );
};

function Navbar() {
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
        <div className="inline-block">
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
        </div>
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
      </div>
    </nav>
  );
}

function Breadcrumbs() {
  const router = useRouter();

  function generateBreadcrumbs() {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split('?')[0]!;

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery
      .split('/')
      .filter(v => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
      // The title will just be the route string for now
      const text = subpath;
      return {href, text};
    });

    // Add in a default "Home" crumb for the top-level
    return [{href: '/', text: 'Home'}, ...crumblist];
  }

  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    <ul>
      {breadcrumbs.map((crumb, index) => (
        <>
          <li className="inline-block">
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
            <Link href={crumb.href} className="inline-block align-middle">
              {crumb.text}
            </Link>
          </li>
        </>
      ))}
    </ul>
  );
}

type ComponentChildren = string | JSX.Element | JSX.Element[];

function Layout({children}: {children: ComponentChildren}) {
  return (
    <div className="flex  h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 pt-4 text-white">
      <Navbar />
      <div className="my-8 flex flex-row justify-between">
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
      <main>{children}</main>
    </div>
  );
}

type Category = {
  title: string;
  subcategories: Subcategory[];
};

type Subcategory = {
  title: string;
  description: string;
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
  subforums?: {title: string}[];
};

const Home: NextPage = () => {
  const categories: Category[] = [
    {
      title: 'General',
      subcategories: [
        {
          title: 'Rules and Systems',
          description:
            'This forum contains rules and explanations for our systems',
          threadsAmount: 7,
          postsAmount: 22,
          hasUnreadPosts: false
        },
        {
          title: 'Doubts and Suggestions',
          description:
            'Whatever doubt or suggestion you have, please contact Ozkr',
          threadsAmount: 7,
          postsAmount: 22,
          hasUnreadPosts: true,
          subforums: [{title: 'doubts'}, {title: 'complaints'}]
        },
        {
          title: 'Offtopic',
          description:
            'This forum contains rules and explanations for our systems',
          threadsAmount: 7,
          postsAmount: 22,
          hasUnreadPosts: true
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Agora</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {categories.map(category => (
          <Category key={category.title} category={category}></Category>
        ))}
      </Layout>
    </>
  );
};

function Category({category}: {category: Category}) {
  return (
    <Accordion.Root type="single" defaultValue="category" collapsible>
      <Accordion.Item value="category">
        <Accordion.Header className="text-md flex h-12 w-full flex-row bg-gray-900 px-4">
          <span className="mx-auto self-center text-xl font-bold">
            {category.title}
          </span>
          <Accordion.Trigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                clipRule="evenodd"
              />
            </svg>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="bg-[#ffffff1a] p-1">
          {category.subcategories.map(subcategory => (
            <div
              key={subcategory.title}
              className="mb-0.5 w-full bg-gray-900 p-4">
              <Link
                href={`/subcategory/${subcategory.title}`}
                className="text-xl font-semibold">
                {subcategory.title}
              </Link>
              <p className="text-md">{subcategory.description}</p>
              <ul className="flex flex-row gap-2">
                <li className="text-xs">
                  Threads:{' '}
                  <span className=" font-semibold">
                    {subcategory.threadsAmount}
                  </span>
                </li>
                <li className="text-xs">
                  Posts:{' '}
                  <span className=" font-semibold">
                    {subcategory.postsAmount}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default Home;

const AuthShowcase: React.FC = () => {
  const {isSignedIn} = useAuth();
  const {data: secretMessage} = trpc.auth.getSecretMessage.useQuery(undefined, {
    enabled: !!isSignedIn
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isSignedIn && (
        <>
          <p className="text-center text-2xl text-white">
            {secretMessage && (
              <span>
                {' '}
                {secretMessage} click the user button!
                <br />
              </span>
            )}
          </p>
          <div className="flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '3rem',
                    height: '3rem'
                  }
                }
              }}
            />
          </div>
        </>
      )}
      {!isSignedIn && (
        <p className="text-center text-2xl text-white">
          <Link href="/sign-in">Sign In</Link>
        </p>
      )}
    </div>
  );
};
