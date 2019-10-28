import { Injector } from './Injector';
import Rcon from 'modern-rcon';
import { Whitelist } from './Whitelist';

type ApiOptions = {
	base: string;
};

export interface IAuthenticator {
	checkPassword(username: string, password: string): Promise<boolean>;
}

export class Authenticator implements IAuthenticator {
	constructor(private client: Rcon) {}

	async checkPassword(username: string, password: string) {
		const whitelist = new Whitelist(this.client);
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

	currentUser() {
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

		app.post(`${base}/login`, (req, res) => {
			const username = req.body.username;
			const password = req.body.password;

			const userSession = Injector.get('userSession', req.session) as UserSession;

			if (userSession.login(username, password)) {
				return res.send({
					message: 'OK',
				});
			}

			return res.send({
				message: 'nope',
			});
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
			return res.send({
				message: userSession.currentUser() || 'nobody',
			});
		});
	}
}
