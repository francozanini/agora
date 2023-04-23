import {router} from '../trpc';
import {authRouter} from './auth';
import {categoriesRouter} from './categories';

export const appRouter = router({
  auth: authRouter,
  categories: categoriesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
