const indexedDB = window.indexedDB;

const DB_NAME = "TogglExtension";
const DB_VERSION = 2;

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);

    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains("LocalData")) {
        console.log("Creating IDB Object Store");
        db.createObjectStore("LocalData", { keyPath: "id" });
      }
    };

    open.onsuccess = () => {
      resolve(open.result);
    };

    open.onerror = reject;
  });

export const getIDBItem = (key) =>
  openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction("LocalData", "readonly");
        const store = transaction.objectStore("LocalData");
        const query = store.get(key);
        query.onsuccess = () => resolve(query.result && query.result.value);
        query.onerror = reject;
        transaction.oncomplete = () => db.close();
        transaction.onerror = reject;
      })
  );

export const setIDBItem = (key, value) =>
  openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction("LocalData", "readwrite");
        const store = transaction.objectStore("LocalData");
        const data = { id: key, value };
        const request = store.put(data);
        request.onerror = reject;
        request.onsuccess = resolve;
        transaction.oncomplete = () => db.close();
        transaction.onerror = reject;
      })
  );

export const clearIDBAll = () =>
  openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction("LocalData", "readwrite");
        const store = transaction.objectStore("LocalData");
        const request = store.clear();
        request.onerror = reject;
        request.onsuccess = resolve;
        transaction.oncomplete = () => db.close();
        transaction.onerror = reject;
      })
  );
