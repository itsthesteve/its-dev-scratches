import { config as envConfig } from 'dotenv';
import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-config.js';

envConfig();
const app = initializeApp(firebaseConfig);

const router = express.Router();
const firestore = getFirestore(app);

router.post('/save-email', async (req, res) => {
	const { email } = req.body;

	// No email posted, return an error.
	if (!email) {
		return res.status(400).json({ message: 'No email supplied.' });
	}

	let statusCode, message;

	try {
		await firestore.collection('signups').add({
			email,
			when: Timestamp.now(),
		});

		statusCode = 201;
		message = 'Email saved.';
	} catch (e) {
		statusCode = 500;
		message = 'Something went wrong.';

		console.log('Error', e);
	}

	res.status(statusCode).json({ message });
});

export default router;
