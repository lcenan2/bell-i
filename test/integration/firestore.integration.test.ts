import { db } from '../config/firebaseTestConfig';
import { collection, addDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';

describe('Firebase Firestore Integration', () => {
  const testCollection = 'integrationTests';
  let docRef: any;

  test('add and get a document', async () => {
    docRef = await addDoc(collection(db, testCollection), { name: 'Test', value: 42 });
    const snapshot = await getDoc(doc(db, testCollection, docRef.id));
    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()).toEqual({ name: 'Test', value: 42 });
    await deleteDoc(doc(db, testCollection, docRef.id));
  });
});