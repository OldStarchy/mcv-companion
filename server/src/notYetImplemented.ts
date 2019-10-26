export class NotYetImplementedError extends Error {}

export function notYetImplemented(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
	if (!(descriptor.value instanceof Function)) {
		throw new Error();
	}

	descriptor.value = () => {
		throw new NotYetImplementedError();
	};
}
