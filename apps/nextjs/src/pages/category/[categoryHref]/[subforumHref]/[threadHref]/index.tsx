import {useRouter} from 'next/router';
import {RouterOutputs, trpc} from '../../../../../utils/trpc';
import Layout from '../../../../../components/layout';
import Link from 'next/link';

function Post({
  post
}: {
  post: RouterOutputs['threads']['withPosts']['posts'][number];
}) {
  return (
    <div className="mx-1 my-4 w-full rounded-lg bg-gray-900 p-4">
      <p>{post.content}</p>
      <hr className="my-1 h-0.5 border-t-0 bg-gray-400 opacity-50" />
      <p className="text-xs">
        by
        <Link
          href={`profile/${post.authorId}`}
          className="ml-1 font-bold hover:underline">
          {post.authorId}
        </Link>{' '}
        at {post.createdAt.toDateString()}
      </p>
    </div>
  );
}

function Thread() {
  const router = useRouter();
  const {categoryHref, subforumHref, threadHref} = router.query;
  const {
    data: thread,
    isLoading,
    isError
  } = trpc.threads.withPosts.useQuery({
    href: `/category/${categoryHref}/${subforumHref}/${threadHref}`
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
    </Layout>
  );
}

export default Thread;
