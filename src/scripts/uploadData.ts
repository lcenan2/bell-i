import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { restaurants } from '../data/Restaurants';
import { dishes } from '../data/Dish';

export async function uploadAllData() {
  try {
    console.log('Starting data upload...');

    for (const restaurant of restaurants) {
      const restaurantRef = doc(db, 'restaurants', restaurant.id);

      await setDoc(restaurantRef, {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: restaurant.location,
        priceLevel: restaurant.priceLevel,
        imageUrl: restaurant.imageUrl,
        averageRating: restaurant.rating,
        totalRatings: restaurant.reviewCount,
        likes: restaurant.likes,
        createdAt: new Date()
      });

      console.log(`Added restaurant: ${restaurant.name}`);

      const restaurantDishes = dishes.filter(
        d => String(d.restaurantId).trim() === String(restaurant.id).trim()
      );

      if (restaurantDishes.length === 0) {
        console.warn(`No dishes found for ${restaurant.name}`);
        continue;
      }

      for (const dish of restaurantDishes) {
        const menuItemsRef = collection(db, 'restaurants', restaurant.id, 'menuItems');

        try {
          await addDoc(menuItemsRef, {
            name: dish.name,
            description: dish.description || '',
            priceCents: typeof dish.priceCents === 'number' ? dish.priceCents : 0,
            photoUrl: dish.photoUrl || '',
            likes: 0,
            averageRating: 0,
            ratingCount: 0,
            createdAt: dish.createdAt ? new Date(dish.createdAt) : new Date()
          });
          console.log(`   🍽 Added dish: ${dish.name}`);
        } catch (dishError) {
          console.error(`Failed to add dish ${dish.name}:`, dishError);
        }
      }

      console.log(`Added ${restaurantDishes.length} menu items for ${restaurant.name}`);
    }

    console.log('All data uploaded successfully!');
    alert('Data uploaded! Check Firebase Console.');
  } catch (error) {
    console.error('Error uploading data:', error);
    alert('Error uploading data: ' + error);
  }
}
