import {useRouter} from 'next/router';
import Layout from '../../components/layout';

function CategoryPage() {
  const router = useRouter();
  const {categoryHref} = router.query;

  return (
    <Layout>
      <p>Hi {categoryHref}</p>
    </Layout>
  );
}

export default CategoryPage;
