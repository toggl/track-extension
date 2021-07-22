const indexedDB = window.indexedDB;

const DB_NAME = 'TogglExtension';
const DB_VERSION = 1;

const open = indexedDB.open(DB_NAME, DB_VERSION);

open.onupgradeneeded = () => {
  const db = open.result;
  db.createObjectStore("LocalData", {keyPath: "id"});
};

export const getIDBItem = (key) => {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION)
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction("LocalData", "readwrite");
      const store = transaction.objectStore("LocalData");
      const query = store.get(key);
      query.onsuccess = () => resolve(query.result && query.result.value);
      query.onerror = reject;
      transaction.oncomplete = () => db.close()
      transaction.onerror = reject
    }
    open.onerror = reject;
  })
}

export const setIDBItem = (key, value) => {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION)
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction("LocalData", "readwrite");
      const store = transaction.objectStore("LocalData");
      const data = {id: key, value}
      const request = store.put(data);
      request.onerror = reject;
      request.onsuccess = resolve;
      transaction.oncomplete = () => db.close()
      transaction.onerror = reject
    }
    open.onerror = reject;
  })
}

export const clearIDBAll = () => {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION)
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction("LocalData", "readwrite");
      const store = transaction.objectStore("LocalData");
      const request = store.clear();
      request.onerror = reject;
      request.onsuccess = resolve;
      transaction.oncomplete = () => db.close()
      transaction.onerror = reject
    }
    open.onerror = reject;
  })
}
