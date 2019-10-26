import express from 'express';
import bodyParser from 'body-parser';
import { Api1, UserSession, Authenticator } from './api1';
import { IMinecraftClient, MinecraftClient1v14, MinecraftRconClient } from './MinecraftClient';
import session from 'express-session';

// TODO: move this kind of thing to config file
const port = 3000;
const message = 'Hello, world!';
const clientRoot = '../client/dist/';
const useHttps = false;
const sessionSecret = "i don't know what this should be";

const app = express();

app.use(bodyParser.json());
app.use(
	express.static(clientRoot, {
		// index: true,
		extensions: ['html'],
	}),
);
app.use(
	session({
		secret: sessionSecret,
		resave: true,
		saveUninitialized: false,
	}),
);

//TODO: get real cliente
const client = new MinecraftClient1v14(new MinecraftRconClient('localhost', 9000));

new Api1({
	client,
	base: '/api/v1',
	authenticator: new Authenticator(client),
}).apply(app);

app.get('/api', (req, res) => {
	res.send({ message });
});

app.listen(port, () => console.log(`MCV Companion listening on port ${port}.`));
