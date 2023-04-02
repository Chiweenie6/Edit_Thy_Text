import { openDB } from "idb";

// creating new database "jate"
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

// Gets all the content from the database
export const getDb = async () => {
  console.log("Get all text 🥅");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readonly");
  const store = newTransaction.objectStore("jate");
  const request = store.getAll();
  const result = await request;
  console.log("result.value", result);
  return result;
};

// Post text to the database
export const postDb = async (content) => {
  console.log("✔️ Post Text");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readwrite");
  const store = newTransaction.objectStore("jate");
  const request = store.add({ text: content });
  const result = await request;
  console.log("👍 Text saved to database", result);
};

// Put accepts some content and adds it to the database
export const putDb = async (id, content) => {
  console.log("Put in Database 🎈");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readwrite");
  const store = newTransaction.objectStore("jate");
  const request = store.put({ id: id, text: content });
  const result = await request;
  console.log("Text saved to the database 🥳", result);
};

// Delete text from the database
export const deleteDb = async (id) => {
  console.log("🔥 Delete from database");
  const jateDB = await openDB("jate", 1);
  const newTransaction = jateDB.transaction("jate", "readwrite");
  const store = newTransaction.objectStore("jate");
  const request = store.delete(id);
  const result = await request;
  console.log("result.value", result);
  return result;
};

// Initialize/start the database
initdb();
