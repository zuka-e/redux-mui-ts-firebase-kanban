import faker from 'faker';

import firebase from '../config/firebase';
import { db } from '../config/firebase';

export const seed = () => {
  faker.locale = 'en';

  [...Array(1)].map(async () => {
    const boardRef = await db.collection('boards').add({
      userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
    const boardId = boardRef.id;
    const boardCollection = db.collection('boards').doc(boardId);

    [...Array(3 + Math.floor(Math.random() * 10))].map(async () => {
      const listsRef = boardCollection.collection('lists');
      const listRef = await listsRef.add({
        userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
        taskBoardId: boardId,
        title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        cards: [],
      });
      const listId = listRef.id;

      [...Array(5 + Math.floor(Math.random() * 10))].map(async () => {
        const cardsRef = boardCollection.collection('cards');
        const docRef = await cardsRef.add({
          userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
          taskListId: listId,
          title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
          body: faker.hacker.phrase(),
          done: Math.floor(Math.random() * 10) % 3 === 0,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        });
        const doc = await docRef.get();
        listsRef.doc(listId).update({
          cards: firebase.firestore.FieldValue.arrayUnion({
            id: doc.id,
            ...doc.data(),
          }),
        });
      });
    });
  });
};
