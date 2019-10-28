import express from 'express';
import bodyParser from 'body-parser';
import { Api1, UserSession, Authenticator, IAuthenticator } from './api1';
import session from 'express-session';
import Rcon from 'modern-rcon';
import { Injector } from './Injector';

// TODO: move this kind of thing to config file
const port = 3000;
const message = 'Hello, world!';
const clientRoot = '../client/dist/';
const useHttps = false;
const sessionSecret = "i don't know what this should be";
const config = {
	rcon: {
		host: 'localhost',
		port: 25575,
		password: 'pineapple',
	},
};

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

// WARNING: Untyped variables ahead
// WARNING: Singleton ahead (singletons are globals in disguise)
Injector.use('rcon', () => new Rcon(config.rcon.host, config.rcon.port, config.rcon.password));
Injector.use('authenticator', () => new Authenticator(Injector.get('rcon') as Rcon));
Injector.use(
	'userSession',
	session => new UserSession(session as Express.Session, Injector.get('authenticator') as IAuthenticator),
);

new Api1({
	base: '/api/v1',
}).apply(app);

app.get('/api', (req, res) => {
	res.send({ message });
});

app.listen(port, () => console.log(`MCV Companion listening on port ${port}.`));
