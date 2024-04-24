// import { restaurantModel } from '../model/restaurant.model';
// import { MongoConnection } from '../loaders/db.loader';
// import restaurants from './restaurants.json';

// (async () => {
// 	await MongoConnection.open();

// 	try {
// 		await restaurantModel.deleteMany();
// 		console.info('DB clean');

// 		await restaurantModel.insertMany(restaurants);
// 		console.info('restaurant insertx');
// 	} catch (err) {
// 		console.error(err);
// 	} finally {
// 		await MongoConnection.close();
// 		console.log('disconect mongo');
// 	}
// })();
