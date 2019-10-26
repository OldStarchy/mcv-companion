import { IMinecraftClient } from './MinecraftClient';
import { fail } from 'assert';
import { stringify } from 'querystring';

type ApiOptions = {
	base: string;
	client: IMinecraftClient;
	authenticator: IAuthenticator;
};

export interface IAuthenticator {
	checkPassword(username: string, password: string): boolean;
}

export class Authenticator implements IAuthenticator {
	constructor(private client: IMinecraftClient) {}

	checkPassword(username: string, password: string) {
		if (this.client.whitelist.contains(username)) {
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
		const { base, authenticator } = this.options;

		app.post(`${base}/login`, (req, res) => {
			const username = req.body.username;
			const password = req.body.password;

			const userSession = new UserSession(req.session!, authenticator);

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
			const userSession = new UserSession(req.session!, authenticator);

			userSession.logout().then(() =>
				res.send({
					message: 'OK',
				}),
			);
		});

		app.get(`${base}/whoami`, (req, res) => {
			const userSession = new UserSession(req.session!, authenticator);
			return res.send({
				message: userSession.currentUser() || 'nobody',
			});
		});
	}
}
