import { openDB } from "idb";

// creating new database named "jate"
const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created 🎉");
    },
  });

// Gets all the saved content from the database
export const getDb = async () => {
  console.log("Get all text 🥅");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readonly");
  const store = newTransaction.objectStore("jate");
  const request = store.getAll();
  const result = await request;
  console.log("result.value", result);
  return result.value;
};

// Put, accepts content that is typed into the editor and saves it to the database
export const putDb = async (content) => {
  console.log("Put in Database 🎈");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readwrite");
  const store = newTransaction.objectStore("jate");
  const request = store.put({ jate: content });
  const result = await request;
  console.log("Text saved to the database 🥳", result);
};

// Initialize/start the database
initdb();
