// IndexedDB utility functions for managing resources, reviews, and users
const DB_NAME = "EdulibraryDB"
const DB_VERSION = 1
const RESOURCES_STORE = "resources"
const REVIEWS_STORE = "reviews"
const USERS_STORE = "users"

let dbInstance = null

export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error("[v0] IndexedDB error:", request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains(RESOURCES_STORE)) {
        const resourceStore = db.createObjectStore(RESOURCES_STORE, { keyPath: "id" })
        resourceStore.createIndex("category", "category", { unique: false })
        resourceStore.createIndex("uploadedDate", "uploadedDate", { unique: false })
      }

      if (!db.objectStoreNames.contains(REVIEWS_STORE)) {
        const reviewStore = db.createObjectStore(REVIEWS_STORE, { keyPath: "id" })
        reviewStore.createIndex("resourceId", "resourceId", { unique: false })
        reviewStore.createIndex("date", "date", { unique: false })
      }

      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const userStore = db.createObjectStore(USERS_STORE, { keyPath: "id" })
        userStore.createIndex("email", "email", { unique: true })
      }
    }
  })
}

// Resources operations
export const addResource = async (resource) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESOURCES_STORE], "readwrite")
    const store = transaction.objectStore(RESOURCES_STORE)
    const request = store.add(resource)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getResources = async () => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESOURCES_STORE], "readonly")
    const store = transaction.objectStore(RESOURCES_STORE)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const deleteResource = async (id) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESOURCES_STORE], "readwrite")
    const store = transaction.objectStore(RESOURCES_STORE)
    const request = store.delete(id)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export const getResourceById = async (id) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([RESOURCES_STORE], "readonly")
    const store = transaction.objectStore(RESOURCES_STORE)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Reviews operations
export const addReview = async (review) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REVIEWS_STORE], "readwrite")
    const store = transaction.objectStore(REVIEWS_STORE)
    const request = store.add(review)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getReviews = async () => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REVIEWS_STORE], "readonly")
    const store = transaction.objectStore(REVIEWS_STORE)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getReviewsByResourceId = async (resourceId) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REVIEWS_STORE], "readonly")
    const store = transaction.objectStore(REVIEWS_STORE)
    const index = store.index("resourceId")
    const request = index.getAll(resourceId)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const deleteReview = async (id) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([REVIEWS_STORE], "readwrite")
    const store = transaction.objectStore(REVIEWS_STORE)
    const request = store.delete(id)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export const addUser = async (user) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE], "readwrite")
    const store = transaction.objectStore(USERS_STORE)
    const request = store.add(user)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getUserByEmail = async (email) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE], "readonly")
    const store = transaction.objectStore(USERS_STORE)
    const index = store.index("email")
    const request = index.get(email)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const getAllUsers = async () => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE], "readonly")
    const store = transaction.objectStore(USERS_STORE)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const deleteUser = async (id) => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([USERS_STORE], "readwrite")
    const store = transaction.objectStore(USERS_STORE)
    const request = store.delete(id)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export const clearAllData = async () => {
  const db = await initializeDB()
  return new Promise((resolve, reject) => {
    const resourceTxn = db.transaction([RESOURCES_STORE], "readwrite")
    const resourceStore = resourceTxn.objectStore(RESOURCES_STORE)
    resourceStore.clear()

    const reviewTxn = db.transaction([REVIEWS_STORE], "readwrite")
    const reviewStore = reviewTxn.objectStore(REVIEWS_STORE)
    reviewStore.clear()

    const userTxn = db.transaction([USERS_STORE], "readwrite")
    const userStore = userTxn.objectStore(USERS_STORE)
    userStore.clear()

    resolve(true)
  })
}
