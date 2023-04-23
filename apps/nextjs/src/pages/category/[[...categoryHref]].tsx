import {useRouter} from 'next/router';
import Layout from '../../components/layout';
import {trpc} from '../../utils/trpc';
import {Category} from '../index';

function CategoryPage() {
  const router = useRouter();
  const {categoryHref} = router.query;

  if (!categoryHref) return <div>Not found</div>;
  const queryInput = {categoryHref: (categoryHref as string[]).join('')};

  const {
    data: category,
    isLoading,
    isError
  } = trpc.categories.byHref.useQuery(queryInput);

  if (isError) return <div>Error</div>;
  if (isLoading) return <div>...Loading</div>;

  return (
    <Layout>
      <Category category={category}></Category>
    </Layout>
  );
}

export default CategoryPage;
