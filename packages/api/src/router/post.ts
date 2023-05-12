import {z} from "zod";
import {publicProcedure, router} from "../trpc";

export const postRouter = router({
  reply: publicProcedure
    .input(
      z.object({
        threadId: z.number().min(1),
        postContent: z.string().nonempty(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const createdPost = await ctx.prisma.post.create({
        data: {
          title: "delete this property in the future",
          Thread: {connect: {id: input.threadId}},
          content: input.postContent,
          authorId: ctx.auth.userId!,
        },
      });

      return {...createdPost, author: ctx.auth.user};
    }),
});
