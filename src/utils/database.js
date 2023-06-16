import mongoose from 'mongoose';

let isConnected = false;

export const connect = async () => {
	mongoose.set('strictQuery', true);

	if (isConnected) {
		console.log('Connected to Mongoose');
		return;
	}

	try {
		const connection = await mongoose.connect(process.env.MONGODB_URI, {
			dbName: process.env.MONGODB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		isConnected = true;

		console.log('Connected to Mongoose');
	} catch (error) {
		console.log(error);
	}
};
