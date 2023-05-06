import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../../components/layout';
import { RouterOutputs, trpc } from '../../../../../utils/trpc';

type PostType = RouterOutputs['threads']['byHref']['posts'][number];

function Post({post}: {post: PostType}) {
  return (
    <div className="mx-1 my-4 w-full rounded-lg bg-gray-900 p-4">
      <p>{post.content}</p>
      <hr className="my-1 h-0.5 border-t-0 bg-gray-400 opacity-50" />
      <p className="text-xs">
        by
        <Link
          href={`profile/${post.authorId}`}
          className="ml-1 font-bold hover:underline">
          {post.author?.username}
        </Link>{' '}
        at {post.createdAt.toDateString()}
      </p>
    </div>
  );
}

function ThreadPage() {
  const router = useRouter();
  const {categoryHref, subforumHref, threadHref} = router.query;
  const {
    data: thread,
    isLoading,
    isError
  } = trpc.threads.byHref.useQuery({
    href: `/category/${categoryHref}/${subforumHref}/${threadHref}`
  });
  const utils = trpc.useContext();
  const {user: currentUser} = useUser();
  const {mutate: reply} = trpc.posts.reply.useMutation({
    onMutate: async function (newPost) {
      await utils.threads.byHref.cancel();
      const prevData = utils.threads.byHref.getData();
      utils.threads.byHref.setData(
        {href: `/category/${categoryHref}/${subforumHref}/${threadHref}`},
        old => {
          return {
            ...old!,
            posts: [
              ...(old?.posts ?? []),
              {
                content: newPost.postContent,
                threadId: newPost.threadId,
                author: currentUser,
                authorId: currentUser?.id,
                createdAt: new Date()
              } as PostType
            ]
          };
        }
      );

      return {prevData};
    }
  });

  if (isError) return <div>Oh no!</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <h2 className="text-center text-6xl font-bold">{thread.title}</h2>
      <ul>
        {thread.posts.map(post => (
          <Post key={post.id} post={post}></Post>
        ))}
      </ul>
      <form
        className="mx-1 flex flex-col gap-4"
        onSubmit={event => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            content: {value: string};
          };
          reply({
            threadId: thread.id,
            postContent: target.content.value
          });
        }}>
        <textarea
          placeholder="Lorem Ipsum"
          name="content"
          className="inter text-md border-t3-purple-200/20 h-64 w-full rounded-md border px-2 py-2 text-black"></textarea>
        <button className="h-8 bg-gray-900" type="submit">
          Reply
        </button>
      </form>
    </Layout>
  );
}

export default ThreadPage;