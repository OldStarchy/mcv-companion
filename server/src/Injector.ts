export class Injector {
	static factories: {
		[serviceName: string]: (...args: unknown[]) => unknown;
	} = {};

	static cache: {
		[serviceName: string]: unknown;
	} = {};

	static use(name: string, factory: (...args: unknown[]) => unknown) {
		this.factories[name] = factory;
	}

	static get(name: string, ...args: unknown[]) {
		return this.factories[name](...args);
	}

	static one(name: string) {
		return this.cache[name] || (this.cache[name] = this.factories[name]());
	}
}
