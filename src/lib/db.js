import { openDB } from 'idb'

const DB_NAME = 'newsbox-db'
const DB_VERSION = 1

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('articles')) {
        db.createObjectStore('articles', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('bookmarks')) {
        db.createObjectStore('bookmarks', { keyPath: 'id' })
      }
    },
  })
}

export async function saveArticles(articles) {
  const db = await getDB()
  const tx = db.transaction('articles', 'readwrite')
  await Promise.all(
    articles.map((article, index) =>
      tx.store.put({
        id: article.url || `local-${index}`,
        article,
      }),
    ),
  )
  await tx.done
}

export async function getAllArticles() {
  const db = await getDB()
  return (await db.getAll('articles')).map((row) => row.article)
}

export async function toggleBookmark(article) {
  const db = await getDB()
  const id = article.url
  if (!id) return false
  const existing = await db.get('bookmarks', id)
  if (existing) {
    await db.delete('bookmarks', id)
    return false
  }
  await db.put('bookmarks', { id, article })
  return true
}

export async function getBookmarks() {
  const db = await getDB()
  return (await db.getAll('bookmarks')).map((row) => row.article)
}
