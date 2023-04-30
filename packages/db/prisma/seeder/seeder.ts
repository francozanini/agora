import {prisma} from '../../index';

async function seed() {
  await prisma.category.create({
    data: {
      title: 'General',
      href: 'general',
      subforums: {
        create: [
          {
            title: 'Rules and Systems',
            href: 'general/rules-and-systems',
            description:
              'This forum contains rules and explanations for our systems'
          },
          {
            title: 'Doubts and Suggestions',
            href: 'general/doubts-and-suggestions',
            description:
              'Whatever doubt or suggestion you have, please contact Ozkr'
          },
          {
            title: 'Offtopic',
            href: 'general/offtopic',
            description: 'Come and vote for the next Pelotud@ of the Month!'
          }
        ]
      }
    }
  });
}

seed();
