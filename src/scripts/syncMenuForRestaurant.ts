import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { dishes } from '../data/Dish'

async function clearMenu(restaurantId: string) {
  const menuRef = collection(db, 'restaurants', restaurantId, 'menuItems')
  const snap = await getDocs(menuRef)
  const deletes = snap.docs.map((d) => deleteDoc(doc(db, 'restaurants', restaurantId, 'menuItems', d.id)))
  await Promise.all(deletes)
}

async function uploadMenu(restaurantId: string) {
  const menuRef = collection(db, 'restaurants', restaurantId, 'menuItems')
  const restaurantDishes = dishes.filter((d) => String(d.restaurantId) === String(restaurantId))

  for (const dish of restaurantDishes) {
    // Use setDoc with a known id to make this idempotent/overwrite existing
    const dishRef = doc(db, 'restaurants', restaurantId, 'menuItems', String(dish.id))
    await setDoc(dishRef, {
      name: dish.name,
      description: dish.description || '',
      priceCents: typeof dish.priceCents === 'number' ? dish.priceCents : 0,
      photoUrl: dish.photoUrl || '',
      likes: 0,
      averageRating: 0,
      ratingCount: 0,
      createdAt: dish.createdAt ? new Date(dish.createdAt) : new Date(),
    })
    console.log(`Uploaded dish ${dish.name}`)
  }
}

async function sync(restaurantId: string) {
  if (!restaurantId) {
    console.error('Usage: pass a restaurant id as the first argument')
    process.exit(1)
  }

  try {
    console.log(`Clearing menu for restaurant ${restaurantId}...`)
    await clearMenu(restaurantId)
    console.log('Uploading local dishes...')
    await uploadMenu(restaurantId)
    console.log('Done.')
    process.exit(0)
  } catch (err) {
    console.error('Sync failed:', err)
    process.exit(2)
  }
}

const restId = process.argv[2]
sync(restId)
