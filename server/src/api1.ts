import { Injector } from './Injector';
import Rcon from 'modern-rcon';
import { RconWhitelist } from './RconWhitelist';
import { RconChat } from './RconChat';
import { RconTitle } from './RconTitle';

type ApiOptions = {
	base: string;
};

export interface IAuthenticator {
	checkPassword(username: string, password: string): Promise<boolean>;
}

export class Authenticator implements IAuthenticator {
	constructor(private client: Rcon) {}

	async checkPassword(username: string, password: string) {
		const whitelist = new RconWhitelist(this.client);
		const players = await whitelist.list();

		// TODO: Check if whitelist is enabled.
		if (players === null) {
			return false;
		}

		username = username.toLowerCase();
		if (players.some(player => player.toLowerCase() === username)) {
			if (username === password) {
				return true;
			}
		}

		return false;
	}
}

export class UserSession {
	constructor(private session: Express.Session, private authenticator: IAuthenticator) {}

	login(username: string, password: string) {
		if (this.authenticator.checkPassword(username, password)) {
			this.session.loggedIn = username;
			return true;
		}

		return false;
	}

	currentUser(): string {
		return this.session!.loggedIn;
	}

	logout() {
		return new Promise(s => {
			this.session!.destroy(s);
		});
	}
}

export class Api1 {
	constructor(private readonly options: ApiOptions) {}

	apply(app: import('express').Express) {
		const { base } = this.options;

		app.post(`${base}/login`, async (req, res) => {
			const username = req.body.username;
			const password = req.body.password;

			const rcon = Injector.get('rcon') as Rcon;
			await rcon.connect();

			try {
				const userSession = new UserSession(req.session!, new Authenticator(rcon));

				const title = new RconTitle(rcon);
				title.announce('Someone logged in', [
					{ text: 'it was ' },
					{
						text: username,
						color: 'dark_green',
					},
				]);

				if (userSession.login(username, password)) {
					res.send({
						message: 'OK',
					});
				} else {
					res.send({
						message: 'nope',
					});
				}
			} finally {
				rcon.disconnect();
			}
		});

		app.get(`${base}/logout`, (req, res) => {
			const userSession = Injector.get('userSession', req.session) as UserSession;

			userSession.logout().then(() =>
				res.send({
					message: 'OK',
				}),
			);
		});

		app.get(`${base}/whoami`, (req, res) => {
			const userSession = Injector.get('userSession', req.session) as UserSession;

			res.send({
				message: userSession.currentUser() || 'nobody',
			});
		});

		app.get(`${base}/whitelist`, async (req, res) => {
			//TODO: require login and permission

			const rcon = Injector.get('rcon') as Rcon;
			await rcon.connect();

			try {
				const whitelist = new RconWhitelist(rcon);

				res.send({
					players: await whitelist.list(),
				});
			} finally {
				rcon.disconnect();
			}
		});

		app.post(`${base}/broadcast`, async (req, res) => {
			const message = req.body.message;
			const userSession = Injector.get('userSession', req.session) as UserSession;

			if (userSession.currentUser() === undefined) {
				res.send({
					error: 'not logged in',
				});
				return;
			}

			const rcon = Injector.get('rcon') as Rcon;
			await rcon.connect();

			try {
				const chat = new RconChat(rcon, userSession.currentUser());

				await chat.broadcast(message);
				res.send({
					message: 'ok',
				});
			} finally {
				rcon.disconnect();
			}
		});

		app.post(`${base}/whisper`, async (req, res) => {
			const to = req.body.to;
			const message = req.body.message;
			const userSession = Injector.get('userSession', req.session) as UserSession;

			if (userSession.currentUser() === undefined) {
				res.send({
					error: 'not logged in',
				});
				return;
			}

			const rcon = Injector.get('rcon') as Rcon;
			await rcon.connect();

			try {
				const chat = new RconChat(rcon, userSession.currentUser());

				const result = await chat.whisper(to, message);
				if (result) {
					res.send({
						message: 'ok',
					});
				} else {
					res.send({
						error: 'player not found',
					});
				}
			} finally {
				rcon.disconnect();
			}
		});
	}
}
