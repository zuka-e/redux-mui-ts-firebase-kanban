import faker from 'faker';

import firebase from '../config/firebase';
import { db } from '../config/firebase';

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

    [...Array(3)].map(async () => {
      const listsRef = db.collection('boards').doc(boardId).collection('lists');
      const listId = await listsRef
        .add({
          userId: 'ArPs4uFdxpgH3kcKE7XoApCpNHF2',
          taskBoardId: boardId,
          title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          cards: [],
        })
        .then((docRef) => docRef.id);

      [...Array(3)].map(async (_, i) => {
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
          .then((docRef) =>
            docRef.get().then(function (doc) {
              listsRef.doc(listId).update({
                cards: firebase.firestore.FieldValue.arrayUnion({
                  id: doc.id,
                  ...doc.data(),
                }),
              });
            })
          );
      });
    });
  });
};
