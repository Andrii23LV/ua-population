import Year from '@/models/year';
import { connect } from '@/utils/database';

export const GET = async (req) => {
	try {
		await connect();
		const years = await Year.find({}).populate('year');

		return new Response(JSON.stringify(years), { status: 200 });
	} catch (err) {
		return new Response('Failed to fetch: ' + err, { status: 500 });
	}
};
