import { getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { google } from 'googleapis';

/**
 * Create the Google sheets client
 */
async function initSheets() {
	const auth = new google.auth.GoogleAuth({
		keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});

	const authClient = await auth.getClient();
	const sheetsClient = google.sheets({
		version: 'v4',
		auth: authClient,
	});

	return sheetsClient;
}

/**
 * @param {string} collection Which Firestore collection to pull from
 */
async function exportFirestoreData(collection) {
	const firestore = getFirestore(getApp());

	if (!collection) {
		throw new Error('Need a collection to export.');
	}

	// Final result
	const data = [];

	const ref = firestore.collection(collection);
	const snapshot = await ref.get();
	snapshot.forEach((doc) => {
		const { email, when } = doc.data();
		data.push({ email, when: when.toDate() });
	});

	return data;
}

/**
 * @param {string[][]} data
 * @param {string} sheetId Google Sheet ID
 * @param {string} sheetName Sheet name to save to
 */
async function populateSheet(data, sheetId, sheetName) {
	const sheets = await initSheets();
	const values = data.map((d) => {
		return [...Object.values(d)];
	});

	try {
		const appendResult = await sheets.spreadsheets.values.update({
			range: `'${sheetName}'!A1`,
			spreadsheetId: sheetId,
			valueInputOption: 'USER_ENTERED',
			requestBody: {
				values,
			},
		});

		return Promise.resolve({ status: appendResult.status });
	} catch (e) {
		return Promise.reject(e);
	}
}

export { exportFirestoreData, populateSheet };
