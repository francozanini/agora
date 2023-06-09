import {clerkClient} from "@clerk/nextjs/server";
import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "../trpc";

export const threadsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        categoryHref: z.string().min(1),
        subforumHref: z.string().min(1),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {categoryHref, subforumHref, title, content} = input;

      return await ctx.prisma.thread.create({
        data: {
          title: title,
          authorId: ctx.auth.userId,
          href: `/category/${categoryHref}/${subforumHref}/${title}`,
          Subforum: {connect: {href: `${categoryHref}/${subforumHref}`}},
          posts: {
            create: {
              content: content,
              title: title,
              authorId: ctx.auth.userId,
            },
          },
        },
        select: {href: true},
      });
    }),
  byHref: publicProcedure
    .input(
      z.object({
        href: z.string().min(1),
      }),
    )
    .query(async ({ctx, input}) => {
      const retrievedThread = await ctx.prisma.thread.findFirstOrThrow({
        where: {href: input.href},
        include: {posts: true},
      });

      const users = await clerkClient.users.getUserList({
        userId: retrievedThread.posts.map(post => post.authorId),
      });

      return {
        ...retrievedThread,
        posts: retrievedThread.posts.map(post => ({
          ...post,
          author: users.find(user => user.id === post.authorId),
        })),
      };
    }),
});
