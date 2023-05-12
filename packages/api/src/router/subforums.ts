import {Subforum, Thread} from "prisma/prisma-client";
import {z} from "zod";
import {publicProcedure, router} from "../trpc";
import {clerkClient} from "@clerk/nextjs/server";

type ThreadPreview = Thread & {authorName: string; replies: number};
type SubforumView = Subforum & {children: Subforum[]; threads: ThreadPreview[]};

export const subforumsRouter = router({
  byHref: publicProcedure
    .input(
      z.object({
        categoryHref: z.string().min(1),
        subforumHref: z.string().min(1),
      }),
    )
    .query(async ({ctx, input}): Promise<SubforumView> => {
      const {categoryHref, subforumHref} = input;
      const subforum = await ctx.prisma.subforum.findFirstOrThrow({
        where: {href: `${categoryHref}/${subforumHref}`},
        include: {
          children: true,
          threads: {include: {_count: {select: {posts: true}}}},
        },
      });

      if (!subforum) {
        throw new Error(`${categoryHref} not found`);
      }

      const authors = await clerkClient.users.getUserList({
        userId: subforum.threads.map(subforum => subforum.authorId),
      });

      return {
        ...subforum,
        threads: subforum.threads.map(thread => ({
          ...thread,
          authorName:
            authors.find(author => author.id === thread.authorId)?.username ??
            "Unknown",
          replies: thread._count.posts,
        })),
      };
    }),
});
