import Rcon from 'modern-rcon';

export interface IWhitelist {
	list(): Promise<string[] | null>;

	/**
	 * Adds a user to the whitelist.
	 *
	 * @param {string} name The name of the player (case insensitive)
	 * @returns the name of the player added with correct casing, true if the player was already whitelisted, or false if the player could not be found.
	 */
	add(name: string): Promise<string | boolean>;

	/**
	 * Removes a user to the whitelist.
	 *
	 * @param {string} name The name of the player (case insensitive)
	 * @returns the name of the player removed with correct casing, true if the player was not already whitelisted, or false if the player could not be found.
	 */
	remove(name: string): Promise<string | boolean>;

	/**
	 * @returns true if the whitelist turned on, false if it was already turned on
	 */
	enable(): Promise<boolean>;

	/**
	 * @returns true if the whitelist turned off, false if it was already turned off
	 */
	disable(): Promise<boolean>;

	/**
	 * @returns true if the whitelist reloaded sucessfully
	 */
	reload(): Promise<boolean>;
}
