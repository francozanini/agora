import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import * as Accordion from '@radix-ui/react-accordion';
import React from 'react';
import Layout from '../components/layout';
import {RouterOutputs, trpc} from '../utils/trpc';
export type ComponentChildren = string | JSX.Element | JSX.Element[];

const Home: NextPage = () => {
  const {
    data: categories,
    isLoading,
    isError
  } = trpc.categories.forCurrentUser.useQuery();

  if (isLoading) return <div>...Loading</div>;
  if (isError) return <div>Oh shit</div>;

  return (
    <>
      <Head>
        <title>Agora</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {categories.map(category => (
          <Category
            className="mb-4"
            key={category.title}
            category={category}></Category>
        ))}
      </Layout>
    </>
  );
};

function Category({
  category,
  className = ''
}: {
  category: RouterOutputs['categories']['forCurrentUser'][number];
  className?: string;
}) {
  return (
    <Accordion.Root
      type="single"
      defaultValue="category"
      collapsible
      className={className}>
      <Accordion.Item value="category">
        <Accordion.Header className="text-md flex h-12 w-full flex-row bg-gray-900 px-4">
          <Link
            href={`/category/${category.href}`}
            className="mx-auto self-center text-xl font-bold">
            {category.title}
          </Link>
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
          {category.subcategories.map(subcategory => (
            <div
              key={subcategory.title}
              className="mb-0.5 w-full bg-gray-900 p-4">
              <Link
                href={`/subcategory/${subcategory.title}`}
                className="text-xl font-semibold">
                {subcategory.title}
              </Link>
              <p className="text-md">{subcategory.description}</p>
              <ul className="flex flex-row gap-2">
                <li className="text-xs">
                  Threads:{' '}
                  <span className=" font-semibold">
                    {subcategory.threadsAmount}
                  </span>
                </li>
                <li className="text-xs">
                  Posts:{' '}
                  <span className=" font-semibold">
                    {subcategory.postsAmount}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default Home;
