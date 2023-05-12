import {clerkClient} from "@clerk/nextjs/server";
import {z} from "zod";
import {publicProcedure, router} from "../trpc";

export const threadsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().nonempty(),
        content: z.string().nonempty(),
        categoryHref: z.string().nonempty(),
        subforumHref: z.string().nonempty(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      if (!ctx.auth.userId) throw new Error("Must be authenticated");
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
        href: z.string().nonempty(),
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
