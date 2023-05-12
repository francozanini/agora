import {publicProcedure, router} from "../trpc";
import type {Category, Subforum} from "prisma/prisma-client";
import {z} from "zod";

type SubforumPresentation = Category & {
  subforums: Subforum[];
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
};

export const categoriesRouter = router({
  forCurrentUser: publicProcedure.query(async ({ctx}) => {
    if (!ctx.auth.sessionId) {
      return await ctx.prisma.category.findMany({
        include: {subforums: true},
      });
    }

    return (await ctx.prisma.category.findMany({
      include: {subforums: true},
    })) as SubforumPresentation[];
  }),
  byHref: publicProcedure
    .input(z.object({categoryHref: z.string().nonempty()}))
    .query(({ctx, input}) => {
      const {categoryHref} = input;
      const category = ctx.prisma.category.findUnique({
        where: {href: categoryHref},
        include: {subforums: true},
      });

      if (!category) {
        throw new Error(`${categoryHref} not found`);
      }

      return category;
    }),
});
