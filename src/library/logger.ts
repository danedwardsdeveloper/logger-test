import { type LogLevel, logLevels } from '@/types/definitions/logLevel';
import { browserLogLevel, serverLogLevel } from './environment/publicVariables';

const isServer = typeof window === 'undefined';

const consoleColours = {
	debug: 'color: #c084fc', // Purple
	info: 'color: #3498DB', // Blue
	warn: 'color: #FFA500', // Orange
	error: 'color: #FF3838', // Red
};

const serverColours = {
	reset: '\x1b[0m',
	debug: '\x1b[35m', // Purple
	info: '\x1b[34m', // Blue
	warn: '\x1b[33m', // Orange
	error: '\x1b[31m', // Red
} as const;

const shouldLog = (messageLevel: LogLevel) => {
	const currentLevel = isServer ? serverLogLevel : browserLogLevel;
	return logLevels[messageLevel] <= logLevels[currentLevel];
};

const safeStringify = (data: unknown): string => {
	if (typeof data === 'string') return data;
	try {
		return JSON.stringify(data, null, 2);
	} catch {
		return '[Unserializable data]';
	}
};

const stringifyArguments = (...args: unknown[]): string[] =>
	args.map((arg) => (typeof arg === 'string' ? arg : safeStringify(arg)));

const createServerLogger = (
	type: 'debug' | 'info' | 'warn' | 'error',
	label: string
) => {
	return (...args: unknown[]) => {
		const message = stringifyArguments(...args).join(' ');
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console[type](
			`${serverColours[type]}${label} ${message}${serverColours.reset}`
		);
	};
};

const createBrowserLogger =
	(type: keyof typeof consoleColours, label: string) =>
	(...args: unknown[]): void => {
		const style = consoleColours[type];
		const message = stringifyArguments(...args).join(' ');
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console[type](`%c${label} ${message}`, style);
	};

const createLogger = (
	type: 'debug' | 'info' | 'warn' | 'error',
	label: string
) =>
	isServer
		? createServerLogger(type, label)
		: createBrowserLogger(type, label);

const logger = {
	debug: shouldLog('level4debug')
		? createLogger('debug', '[DEBUG]')
		: () => {},
	info: shouldLog('level3info') ? createLogger('info', '[INFO]') : () => {},
	warn: shouldLog('level2warn') ? createLogger('warn', '[WARN]') : () => {},
	error: shouldLog('level1error')
		? createLogger('error', '[ERROR]')
		: () => {},
};

export default logger;
