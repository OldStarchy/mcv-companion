import { debounce } from './debounce';
import { notYetImplemented } from './notYetImplemented';

export interface IPlayer {
	uuid: string;
	name: string;
}

export class Whitelist {
	private players: string[] = [];

	constructor(private readonly client: IMinecraftRconClient) {}

	@debounce(1000)
	private refresh() {
		// There are 10 whitelisted players: name, name, name
		const regex = /^There (?:are|is) (?<playerCount>\d+) whitelisted players?:(?<playerList>.*)$/u;

		const response = this.client.run('whitelist list');

		let match: RegExpMatchArray | null;

		if (null !== (match = regex.exec(response))) {
			this.players = match.groups!.playerList.split(',').map(name => name.trim());
		}
	}

	contains(name: string) {
		this.refresh();
		return this.players.includes(name);
	}

	@notYetImplemented
	add(name: string) {}

	@notYetImplemented
	remove(name: string) {}
}

export interface IMinecraftClient {
	readonly whitelist: Whitelist;
}

export class MinecraftClient1v14 implements IMinecraftClient {
	public readonly whitelist: Whitelist;

	constructor(private readonly client: IMinecraftRconClient) {
		this.whitelist = new Whitelist(this.client);
	}
}

interface IMinecraftRconClient {
	run(
		command: string,
		options?:
			| {
					/**
					 * Capture this number of lines in the response
					 */
					lineCount: number;
			  }
			| {
					/**
					 * Continue capturing lines until the predicate returns false
					 */
					predicate: (line: string) => boolean;
			  },
	): string;
}
export class MinecraftRconClient implements IMinecraftRconClient {
	constructor(private readonly host: string, private readonly port: number) {}
	run(
		command: string,
		options?:
			| {
					/**
					 * Capture this number of lines in the response
					 */
					lineCount: number;
			  }
			| {
					/**
					 * Continue capturing lines until the predicate returns false
					 */
					predicate: (line: string) => boolean;
			  },
	): string {
		return 'There are 10 whitelisted players: bob, jim, joe';
	}
}
