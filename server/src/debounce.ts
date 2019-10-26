export function debounce(timeout: number) {
	return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
		if (!(descriptor.value instanceof Function)) {
			throw new Error();
		}
		let lastCall = 0;
		const original = descriptor.value;
		descriptor.value = function(...args: unknown[]) {
			if (Date.now() < lastCall + 1000) {
				return;
			}
			lastCall = Date.now();
			return original.apply(this, args);
		};
	};
}
