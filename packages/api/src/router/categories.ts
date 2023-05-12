import {publicProcedure, router} from "../trpc";
import type {Category, Subforum} from "prisma/prisma-client";
import {z} from "zod";

type Counts = {
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
};

type SubforumPresentation = Category & {
  subforums: (Subforum & Counts)[];
};

const threadAndPostCount = {
  subforums: {
    include: {
      threads: {include: {_count: {select: {posts: true}}}},
      _count: {select: {threads: true}},
    },
  },
};

function withStatistics(
  category: Category & {
    subforums: (Subforum & {
      _count: {threads: number};
      threads: {_count: {posts: number}}[];
    })[];
  },
): SubforumPresentation {
  return {
    ...category,
    subforums: category.subforums.map(subforum => ({
      ...subforum,
      hasUnreadPosts: false,
      threadsAmount: subforum._count.threads,
      postsAmount: subforum.threads.reduce(
        (acc, next) => acc + next._count.posts,
        0,
      ),
    })),
  };
}

const forCurrentUser = publicProcedure.query(
  async ({ctx}): Promise<SubforumPresentation[]> => {
    if (!ctx.auth.sessionId) {
      return (await ctx.prisma.category.findMany({
        include: {subforums: true},
      })) as SubforumPresentation[];
    }

    const categoriesFromDb = await ctx.prisma.category.findMany({
      include: threadAndPostCount,
    });

    return categoriesFromDb.map(category => withStatistics(category));
  },
);

const byHref = publicProcedure
  .input(z.object({categoryHref: z.string().min(1)}))
  .query(async ({ctx, input}): Promise<SubforumPresentation> => {
    const {categoryHref} = input;

    const category = await ctx.prisma.category.findUnique({
      where: {href: categoryHref},
      include: threadAndPostCount,
    });

    if (!category) {
      throw new Error(`${categoryHref} not found`);
    }

    return withStatistics(category);
  });

export const categoriesRouter = router({
  forCurrentUser,
  byHref,
});
