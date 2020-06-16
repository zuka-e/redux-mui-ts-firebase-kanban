import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export const addMessage = functions.https.onRequest(
  async (request, response) => {
    response.send(functions.config().firebase);
    const original = request.query.text;
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    const writeResult = await admin
      .firestore()
      .collection('messages')
      .add({ original: original });
    // Send back a message that we've succesfully written the message
    response.json({ result: `Message with ID: ${writeResult.id} added.` });
    console.log(response);
  }
);

export const makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    console.log('Uppercasing', context.params, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Cloud Firestore.
    // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });
