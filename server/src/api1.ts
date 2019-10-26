import { IMinecraftClient } from './MinecraftClient';
import { fail } from 'assert';

type ApiOptions = {
	base: string;
	client: IMinecraftClient;
};

export class Api1 {
	constructor(private readonly options: ApiOptions) {}

	apply(app: import('express').Express) {
		const { base, client } = this.options;

		app.post(`${base}/login`, (req, res) => {
			const username = req.body.username;

			if (!username) {
				return res.send({
					message: 'nope',
				});
			}

			if (client.whitelist.contains(username)) {
				return res.send({
					message: 'OK',
				});
			}

			return res.send({
				message: 'nope',
			});
		});
	}
}
