import Rcon from 'modern-rcon';
import { RichText } from './RichText';

export class RconTitle {
	constructor(private client: Rcon) {}

	async announce(title: RichText, subtitle: RichText) {
		await this.client.send(`title @a subtitle ${JSON.stringify(subtitle)}`);
		await this.client.send(`title @a title ${JSON.stringify(title)}`);
	}
}
