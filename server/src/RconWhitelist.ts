import Rcon from 'modern-rcon';
import { IWhitelist } from './IWhitelist';
import { validatePlayerName } from './validatePlayerName';

export class RconWhitelist implements IWhitelist {
	constructor(private client: Rcon) {}

	async list() {
		const response = await this.client.send('whitelist list');

		const regex = /^There (?:are|is) (?<playerCount>\d+) whitelisted players?:(?<playerList>.*)$/u;
		const match = regex.exec(response);

		if (null !== match) {
			return match.groups!.playerList.split(',').map(name => name.trim());
		}

		return null;
	}

	/**
	 * Adds a user to the whitelist.
	 *
	 * @param {string} name The name of the player (case insensitive)
	 * @returns the name of the player added with correct casing, true if the player was already whitelisted, or false if the player could not be found.
	 */
	async add(name: string) {
		if (!validatePlayerName(name)) {
			throw new Error('Invalid name');
		}

		const result = await this.client.send(`whitelist add ${name}`);

		const regex = /^Added (?<name>[^\s]+) to the whitelist$/u;
		const match = regex.exec(result);

		if (null !== match) {
			return match.groups!.name;
		}

		if (result === 'Player is already whitelisted') {
			return true;
		}

		return false;
	}

	/**
	 * Removes a user to the whitelist.
	 *
	 * @param {string} name The name of the player (case insensitive)
	 * @returns the name of the player removed with correct casing, true if the player was not already whitelisted, or false if the player could not be found.
	 */
	async remove(name: string) {
		if (!validatePlayerName(name)) {
			throw new Error('Invalid name');
		}

		const result = await this.client.send(`whitelist remove ${name}`);

		const regex = /^Removed (?<name>[^\s]+) from the whitelist$/u;
		const match = regex.exec(result);

		if (null !== match) {
			return match.groups!.name;
		}

		if (result === 'Player is not whitelisted') {
			return true;
		}

		return false;
	}

	/**
	 * @returns true if the whitelist turned on, false if it was already turned on
	 */
	async enable() {
		const result = await this.client.send('whitelist on');

		return result === 'Whitelist is now turned on';
	}

	/**
	 * @returns true if the whitelist turned off, false if it was already turned off
	 */
	async disable() {
		const result = await this.client.send('whitelist off');

		return result === 'Whitelist is now turned off';
	}

	/**
	 * @returns true if the whitelist reloaded sucessfully
	 */
	async reload() {
		const result = await this.client.send('whitelist reload');

		return result === 'Reloaded the whitelist';
	}
}
