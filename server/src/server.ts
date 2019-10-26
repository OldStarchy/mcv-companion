import express from 'express';
import bodyParser from 'body-parser';
import { Api1 } from './api1';
import { IMinecraftClient, MinecraftClient1v14, MinecraftRconClient } from './MinecraftClient';

const app = express();
const port = 3000;
const message = 'Hello, world!';
const clientRoot = '../client/dist/';

app.use(bodyParser.json());
app.use(
	express.static(clientRoot, {
		// index: true,
		extensions: ['html'],
	}),
);

//TODO: get real cliente
const client = new MinecraftClient1v14(new MinecraftRconClient('localhost', 9000));

new Api1({
	client,
	base: '/api/v1',
}).apply(app);

app.get('/api', (req, res) => {
	res.send({ message });
});

app.listen(port, () => console.log(`MCV Companion listening on port ${port}.`));
