import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created 🎉');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (id, content) =>  {
  console.log("Put in Database 🎈")
  const jateDB = await openDB ("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readwrite");
  const store = newTransaction.objectStore("jate");
  const request = store.put({ id: id, text: content});
  const result = await request;
  console.log("Text saved to the database 🥳", result)
  console.error('🚫 putDb not implemented 🚫');
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log("Get all text 🥅");
  const jateDB = await openDB ("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readonly");
  const store = newTransaction.objectStore("jate");
  const request = store.getAll();
  const result = await request;
  console.log("result.value", result);
  console.error('🚫 getDb not implemented 🚫');
  return result;
};

initdb();
