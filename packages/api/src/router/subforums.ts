import {Subforum, Thread} from "prisma/prisma-client";
import {z} from "zod";
import {publicProcedure, router} from "../trpc";

type ThreadPreview = Thread & {authorName: string; replies: number};
type SubforumView = Subforum & {children: Subforum[]; threads: ThreadPreview[]};

export const subforumsRouter = router({
  byHref: publicProcedure
    .input(
      z.object({
        categoryHref: z.string().nonempty(),
        subforumHref: z.string().nonempty(),
      }),
    )
    .query(async ({ctx, input}): Promise<SubforumView> => {
      const {categoryHref, subforumHref} = input;
      const subforum = await ctx.prisma.subforum.findFirstOrThrow({
        where: {href: `${categoryHref}/${subforumHref}`},
        include: {children: true, threads: true},
      });

      if (!subforum) {
        throw new Error(`${categoryHref} not found`);
      }

      return {
        ...subforum,
        threads: subforum.threads.map(thread => ({
          ...thread,
          authorName: "Someguy",
          replies: 4,
        })),
      };
    }),
});
