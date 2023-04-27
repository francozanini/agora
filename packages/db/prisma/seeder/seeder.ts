import {prisma} from '../../index';

async function seed() {
  await prisma.subforum.create({
    data: {
      title: 'General',
      href: 'general',
      children: {
        create: [
          {
            title: 'Rules and Systems',
            href: 'rules-and-systems',
            description:
              'This forum contains rules and explanations for our systems'
          },
          {
            title: 'Doubts and Suggestions',
            href: 'doubts-and-suggestions',
            description:
              'Whatever doubt or suggestion you have, please contact Ozkr'
          },
          {
            title: 'Offtopic',
            href: 'offtopic',
            description: 'Come and vote for the next Pelotud@ of the Month!'
          }
        ]
      }
    }
  });
}

seed();
