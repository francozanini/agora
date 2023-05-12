import {useRouter} from "next/router";
import Layout from "../../components/layout";
import {trpc} from "../../utils/trpc";
import {Category} from "../index";

function CategoryPage() {
  const router = useRouter();
  const {categoryHref: categoryHref} = router.query;

  if (!categoryHref) return <div>Not found</div>;

  const {
    data: category,
    isLoading,
    isError,
  } = trpc.categories.byHref.useQuery({categoryHref: categoryHref as string});

  if (isError || !category) return <div>Error</div>;
  if (isLoading) return <div>...Loading</div>;

  return (
    <Layout>
      <Category category={category}></Category>
    </Layout>
  );
}

export default CategoryPage;
