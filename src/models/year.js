import { Schema, model, models } from 'mongoose';

const YearSchema = new Schema({
	year: {
		type: Number,
		unique: [true, 'Year is already added'],
	},
	data: [
		{
			region: {
				type: String,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
		},
	],
});

const Year = models.Year || model('Year', YearSchema);

export default Year;
