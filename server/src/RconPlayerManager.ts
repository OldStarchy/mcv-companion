import Rcon from 'modern-rcon';
import { validatePlayerName } from './validatePlayerName';

export class RconPlayerManager {
	constructor(private client: Rcon) {}

	async list() {
		const response = await this.client.send('list');

		const regex = /^There (?:are|is) (?<playerCount>\d+) of a max (?<playerLimit>\d+) players? online:(?<playerList>.*)$/u;
		const match = regex.exec(response);

		if (null !== match) {
			return match.groups!.playerList.split(',').map(name => name.trim());
		}

		return null;
	}

	async kick(name: string, reason?: string) {
		if (!validatePlayerName(name)) {
			throw new Error('Invalid name');
		}

		let cmd = `kick ${name}`;
		if (reason) cmd += ` ${reason}`;

		const result = await this.client.send(cmd);

		const regex = /^Kicked (?<name>[^\s]+): Kicked by an operator$/u;
		const match = regex.exec(result);

		if (null !== match) {
			return true;
		}

		return false;
	}

	async op(name: string) {
		if (!validatePlayerName(name)) {
			throw new Error('Invalid name');
		}

		const result = await this.client.send(`op ${name}`);

		const regex = /^Made (?<name>[^\s]+) a server operator$/u;
		const match = regex.exec(result);

		if (null !== match) {
			return true;
		}

		if (result.startsWith('Nothing changed.')) {
			return true;
		}

		return false;
	}

	async deop(name: string) {
		if (!validatePlayerName(name)) {
			throw new Error('Invalid name');
		}

		const result = await this.client.send(`deop ${name}`);

		const regex = /^Made (?<name>[^\s]+) no longer a server operator$/u;
		const match = regex.exec(result);

		if (null !== match) {
			return true;
		}

		if (result.startsWith('Nothing changed.')) {
			return true;
		}

		return false;
	}
}
