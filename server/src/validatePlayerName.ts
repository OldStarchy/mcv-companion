export function validatePlayerName(name: string) {
	name = name.trim();

	if (name === '') return false;

	return /^[\w\d]{3,16}$/u.test(name);
}
