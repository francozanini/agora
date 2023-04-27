import {publicProcedure, router} from '../trpc';
import {z} from 'zod';

type Subcategory = {
  title: string;
  description: string;
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
  subforums?: {title: string}[];
  href: string;
};

export const categoriesRouter = router({
  forCurrentUser: publicProcedure.query(({ctx}) => {
    if (!ctx.auth.sessionId) {
      return ctx.prisma.subforum.findMany({
        where: {parent: null},
        include: {children: true}
      });
    }

    return ctx.prisma.subforum.findMany({
      where: {parent: null},
      include: {children: true}
    });
  }),
  byHref: publicProcedure
    .input(z.object({categoryHref: z.string().nonempty()}))
    .query(({ctx, input}) => {
      const {categoryHref} = input;
      const category = ctx.prisma.subforum.findUnique({
        where: {href: categoryHref},
        include: {children: true}
      });

      if (!category) {
        throw new Error(`${categoryHref} not found`);
      }

      return category;
    })
});
