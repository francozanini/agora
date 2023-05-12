import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import {useRouter} from "next/router";
import Layout from "../../../components/layout";
import {RouterOutputs, trpc} from "../../../utils/trpc";
import { Error, Loading, NotFound } from "../../../components/skeletons";

type Subforum = RouterOutputs["subforums"]["byHref"]["children"];
type Thread = RouterOutputs["subforums"]["byHref"]["threads"][number];

function SubforumList({subforums}: {subforums: Subforum}) {
  if (!subforums.length) {
    return null;
  }

  return (
    <ul>
      {subforums.map(subforum => (
        <li key={subforum.id}>{subforum.title}</li>
      ))}
      ;
    </ul>
  );
}

function Threads({threads}: {threads: Thread[]}) {
  if(threads.length === 0) {
    return <p>No threads have been created yet.</p>
  }
  // TODO: Maybe extract a component from here and category?
  return (
    <Accordion.Root type="single" defaultValue="single" collapsible>
      <Accordion.Item value="single" className="bg-white shadow-lg">
        <Accordion.Header className="text-md flex h-12 w-full flex-row px-4  dark:bg-gray-900">
          <span className="mx-auto self-center text-xl font-bold">Threads</span>
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
          {threads.map(thread => (
            <div
              key={thread.title}
              className="mb-0.5 bg-slate-100 rounded-lg flex w-full flex-col p-4 dark:bg-gray-900">
              <Link href={thread.href} className="text-2xl font-semibold">
                {thread.title}
              </Link>
              <Link className="text-sm" href={`/profile/${thread.authorId}`}>
                Last post by{" "}
                <span className="font-semibold hover:underline">
                  {thread.authorName}
                </span>
              </Link>
              <div className="text-sm">
                Replies: <span className="font-semibold">{thread.replies}</span>
              </div>
            </div>
          ))}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default function CategoryPage() {
  const router = useRouter();
  const {categoryHref, subforumHref} = router.query;

  if (!categoryHref || !subforumHref) return <NotFound></NotFound>;

  const {
    data: subforum,
    isLoading,
    isError,
  } = trpc.subforums.byHref.useQuery({
    categoryHref: categoryHref as string,
    subforumHref: subforumHref as string,
  });

  if (isError) return <Error></Error>;
  if (isLoading) return <Loading></Loading>;

  return (
    <Layout>
      <Link
        className="mb-4 inline-block p-2 text-sm rounded-lg text-white bg-primary dark:bg-gray-900"
        href={`/category/${categoryHref}/${subforumHref}/newThread`}>
        <span className="inline-block align-middle">New Thread</span>
        <span className="ml-1 inline-block align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4">
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
          </svg>
        </span>
      </Link>
      <SubforumList subforums={subforum.children}></SubforumList>
      <Threads threads={subforum.threads}></Threads>
    </Layout>
  );
}
