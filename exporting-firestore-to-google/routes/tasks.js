import express from 'express';
import * as sheetUtils from '../sheets.js';

const router = express.Router();

/**
 * Exports data from the signups collection to a Google sheet
 */
router.get('/export', async (req, res) => {
	const { SHEET_ID, SHEET_NAME } = process.env;

	// Need a sheet ID and name to save to
	if (!SHEET_ID || !SHEET_NAME) {
		throw new Error('Invalid sheet parameters.');
	}

	try {
		const data = await sheetUtils.exportFirestoreData('signups');
		await sheetUtils.populateSheet(data, SHEET_ID, SHEET_NAME);

		res.json({ message: 'OK' });
	} catch (e) {
		res.json({ message: 'Error saving to sheets' });
		console.log(e);
	}
});

export default router;
