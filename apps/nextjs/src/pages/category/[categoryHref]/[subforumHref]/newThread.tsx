import {useRouter} from "next/router";
import Layout from "../../../../components/layout";
import {trpc} from "../../../../utils/trpc";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {getAuth, buildClerkProps} from "@clerk/nextjs/server";
import {redirect} from "next/dist/server/api-utils";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const {userId} = getAuth(ctx.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  }
  return {props: {...buildClerkProps(ctx.req)}};
};

function CreateThreadPage() {
  const router = useRouter();
  const {categoryHref, subforumHref} = router.query;
  const {mutate: createThread} = trpc.threads.create.useMutation({
    onSuccess: response => router.push(response.href),
  });

  if (!categoryHref || !subforumHref) return <div>Thread not found</div>;

  return (
    <Layout>
      <form
        className="flex flex-col gap-4"
        onSubmit={async event => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            title: {value: string};
            content: {value: string};
          };
          createThread({
            categoryHref: categoryHref as string,
            subforumHref: subforumHref as string,
            title: target.title.value,
            content: target.content.value,
          });
        }}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="inter text-md dark:border-t3-purple-200/20 h-8 w-full rounded-md px-2 py-2 text-black shadow-lg outline-none"
        />
        <textarea
          placeholder="Lorem Ipsum"
          name="content"
          className="inter text-md dark:border-t3-purple-200/20 h-64 w-full rounded-md border px-2 py-2 text-black shadow-lg outline-none"></textarea>
        <button
          className="bg-primary h-8 rounded-lg text-white dark:bg-gray-900"
          type="submit">
          Post
        </button>
      </form>
    </Layout>
  );
}

export default CreateThreadPage;
