export function requireVariable(name: string): string {
	if (typeof window !== 'undefined') {
		throw new Error('Browser attempting to import a private environment variable')
	}

	const value = process.env[name]
	if (!value) {
		// biome-ignore lint/suspicious/noConsole:
		console.error(`${name} missing`)
		throw new Error(`${name} missing`)
	}
	return value
}
