import {useRouter} from "next/router";
import Layout from "../../components/layout";
import {trpc} from "../../utils/trpc";
import {Category} from "../index";
import { Error, Loading } from "../../components/skeletons";

function CategoryPage() {
  const router = useRouter();
  const {categoryHref: categoryHref} = router.query;

  if (!categoryHref) return <div>Not found</div>;

  const {
    data: category,
    isLoading,
    isError,
  } = trpc.categories.byHref.useQuery({categoryHref: categoryHref as string});

  if (isError) return <Error></Error>;
  if (isLoading || !category) return <Loading></Loading>;

  return (
    <Layout>
      <Category category={category}></Category>
    </Layout>
  );
}

export default CategoryPage;
