import {publicProcedure, router} from "../trpc";
import type {Category, Subforum} from "prisma/prisma-client";
import {z} from "zod";

type Counts = {
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
}

type SubforumPresentation = Category & {
  subforums: (Subforum & Counts)[];
  };

export const categoriesRouter = router({
  forCurrentUser: publicProcedure.query(async ({ctx}): Promise<SubforumPresentation[]> => {
    if (!ctx.auth.sessionId) {
      return await ctx.prisma.category.findMany({
        include: {subforums: true},
      }) as SubforumPresentation[];
    }

    const categoriesFromDb = await ctx.prisma.category.findMany({
      include: { subforums: { include: { threads: {include: {_count: {select: {posts: true}}}}, _count: { select: { threads: true } } } }, },
    });


    return categoriesFromDb.map(category => ({...category, subforums: category.subforums.map(subforum => ({...subforum, hasUnreadPosts: false, postsAmount: subforum.threads.reduce((acc, next) => acc + next._count.posts, 0), threadsAmount: subforum._count.threads}))})) as SubforumPresentation[];
  }),
  byHref: publicProcedure
    .input(z.object({categoryHref: z.string().nonempty()}))
    .query(async ({ctx, input}): Promise<SubforumPresentation> => {
      const {categoryHref} = input;
      const category = await ctx.prisma.category.findUnique({
        where: {href: categoryHref},
        include: {subforums: {include: {_count: {select: {threads: true,}}}},},
      });

      if (!category) {
        throw new Error(`${categoryHref} not found`);
      }

      return {...category, subforums: category.subforums.map(subforum => ({...subforum, hasUnreadPosts: false, threadsAmount: subforum._count.threads, postsAmount: 0}))};
    }),
});
