import {router} from "../trpc";
import {authRouter} from "./auth";
import {categoriesRouter} from "./categories";
import {subforumsRouter} from "./subforums";
import {threadsRouter} from "./threads";
import {postRouter} from "./post";

export const appRouter = router({
  auth: authRouter,
  categories: categoriesRouter,
  subforums: subforumsRouter,
  threads: threadsRouter,
  posts: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
