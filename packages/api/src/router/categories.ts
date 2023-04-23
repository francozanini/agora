import {router, publicProcedure, protectedProcedure} from '../trpc';
import {z} from 'zod';

type Category = {
  title: string;
  subcategories: Subcategory[];
  href: string;
};

type Subcategory = {
  title: string;
  description: string;
  threadsAmount: number;
  postsAmount: number;
  hasUnreadPosts: boolean;
  subforums?: {title: string}[];
  href: string;
};

const publicCategories: Category[] = [
  {
    title: 'General',
    href: 'general',
    subcategories: [
      {
        title: 'Rules and Systems',
        href: 'rules-and-systems',
        description:
          'This forum contains rules and explanations for our systems',
        threadsAmount: 7,
        postsAmount: 22,
        hasUnreadPosts: false
      },
      {
        title: 'Doubts and Suggestions',
        href: 'doubts-and-suggestions',
        description:
          'Whatever doubt or suggestion you have, please contact Ozkr',
        threadsAmount: 7,
        postsAmount: 22,
        hasUnreadPosts: true,
        subforums: [{title: 'doubts'}, {title: 'complaints'}]
      },
      {
        title: 'Offtopic',
        href: 'offtopic',
        description: 'Come and vote for the next Pelotud@ of the Month!',
        threadsAmount: 7,
        postsAmount: 22,
        hasUnreadPosts: true
      }
    ]
  },
  {
    title: 'Another Category',
    href: 'another-category',
    subcategories: [
      {
        title: 'Lorem ipsum',
        href: 'lorem-ipsum',
        hasUnreadPosts: true,
        description: 'Suculento rufian',
        postsAmount: 0,
        threadsAmount: 0
      }
    ]
  }
];

const allCategories: Category[] = [
  {
    title: 'Private Category',
    href: 'private-cat',
    subcategories: [
      {
        title: 'private',
        href: 'private-subcat',
        description: 'Only allowed users can see this',
        postsAmount: 0,
        threadsAmount: 0,
        hasUnreadPosts: false,
        subforums: []
      }
    ]
  },
  ...publicCategories
];
export const categoriesRouter = router({
  forCurrentUser: publicProcedure.query(({ctx}) => {
    if (!ctx.auth.sessionId) {
      return publicCategories;
    }

    return allCategories;
  })
});
