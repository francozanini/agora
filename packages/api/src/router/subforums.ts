import {z} from 'zod';
import {publicProcedure, router} from '../trpc';

export const subforumsRouter = router({
  byHref: publicProcedure
    .input(
      z.object({
        categoryHref: z.string().nonempty(),
        subforumHref: z.string().nonempty()
      })
    )
    .query(({ctx, input}) => {
      const {categoryHref, subforumHref} = input;
      const subforum = ctx.prisma.subforum.findFirstOrThrow({
        where: {href: `${categoryHref}/${subforumHref}`},
        include: {children: true, threads: true}
      });

      if (!subforum) {
        throw new Error(`${categoryHref} not found`);
      }

      return subforum;
    })
});
