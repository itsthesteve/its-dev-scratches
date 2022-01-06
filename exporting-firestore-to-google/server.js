import { config as envConfig } from 'dotenv';
import express, { json, urlencoded } from 'express';
import ejs from 'ejs';

envConfig();

import apiRoutes from './routes/api.js';
import taskRoutes from './routes/tasks.js';

const app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(json());
app.use(urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.render('index');
});

app.use('/api', apiRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
