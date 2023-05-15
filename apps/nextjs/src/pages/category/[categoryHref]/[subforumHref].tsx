import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import {useRouter} from "next/router";
import Layout from "../../../components/layout";
import {RouterOutputs, trpc} from "../../../utils/trpc";
import {Error, Loading, NotFound} from "../../../components/skeletons";
import CollapsibleCard from "../../../components/collapsibleCard";

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
  if (threads.length === 0) {
    return <p>No threads have been created yet.</p>;
  }

  return (
    <CollapsibleCard>
      <CollapsibleCard.CardHeader>
        <span className="mx-auto self-center text-xl font-bold">Threads</span>
      </CollapsibleCard.CardHeader>
      <CollapsibleCard.CardContent>
        {threads.map(thread => (
          <div
            key={thread.title}
            className="mb-0.5 flex w-full flex-col rounded-lg bg-slate-100 p-4 dark:bg-gray-900">
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
      </CollapsibleCard.CardContent>
    </CollapsibleCard>
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
        className="bg-primary mb-4 inline-block rounded-lg p-2 text-sm text-white dark:bg-gray-900"
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
