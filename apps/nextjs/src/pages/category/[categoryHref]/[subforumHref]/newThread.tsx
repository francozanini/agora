import {useRouter} from 'next/router';
import Layout from '../../../../components/layout';
import {trpc} from '../../../../utils/trpc';

function CreateThreadPage() {
  const {categoryHref, subforumHref} = useRouter().query;
  const {mutate: createThread} = trpc.threads.create.useMutation();

  if (!categoryHref || !subforumHref) return <div>Thread not found</div>;

  return (
    <Layout>
      <form
        className="flex flex-col gap-4"
        onSubmit={event => {
          event.preventDefault();
          const target = event.target as typeof event.target & {
            title: {value: string};
            content: {value: string};
          };
          createThread({
            categoryHref: categoryHref as string,
            subforumHref: subforumHref as string,
            title: target.title.value,
            content: target.content.value
          });
        }}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="inter text-md border-t3-purple-200/20 h-8 w-full rounded-md px-2 py-2 text-black"
        />
        <textarea
          placeholder="Lorem Ipsum"
          name="content"
          className="inter text-md border-t3-purple-200/20 h-64 w-full rounded-md border px-2 py-2 text-black"></textarea>
        <button className="h-8 bg-gray-900" type="submit">
          Post
        </button>
      </form>
    </Layout>
  );
}

export default CreateThreadPage;
