import { db } from '../config/firebase';
import faker from 'faker';

export const seed = () => {
  faker.locale = 'en';

  [...Array(1)].map(async () => {
    const boardId = await db
      .collection('boards')
      .add({
        userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
        title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      })
      .then((docRef) => docRef.id);

    [...Array(3 + Math.floor(Math.random() * 10))].map(async () => {
      const listsRef = db.collection('boards').doc(boardId).collection('lists');
      const listId = await listsRef
        .add({
          userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
          taskBoardId: boardId,
          title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        })
        .then((docRef) => docRef.id);

      [...Array(5 + Math.floor(Math.random() * 10))].map(async (_, i) => {
        const cardsRef = db
          .collection('boards')
          .doc(boardId)
          .collection('cards');
        cardsRef
          .add({
            userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
            taskListId: listId,
            title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
            body: faker.hacker.phrase(),
            done: i % 3 === 0,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          })
          .then((docRef) => docRef.id);
      });
    });
  });
};
