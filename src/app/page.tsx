'use client';
import logger from '@/library/logger';
import type { LogLevel } from '@/types';
import { useEffect } from 'react';
import type { LogPOSTbody, LogPOSTresponse } from './api/log/route';

export default function Home() {
	useEffect(() => {
		async function fetchProducts() {
			const response = await fetch('https://dummyjson.com/products');
			const data = await response.json();
			logger.info('Data: ', data);
		}
		fetchProducts();

		const object = {
			property: 'property',
			something: 'something',
		};

		logger.info('Object: ', object);
	}, []);

	async function handleClick(level: LogLevel) {
		const body: LogPOSTbody = {
			message: 'It is a truth universally acknowledged',
			level,
		};

		const response = await fetch('/api/log', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const { message }: LogPOSTresponse = await response.json();
		if (response.status !== 200) {
			logger.error('Error: ', message);
		}
	}

	return (
		<div className="w-full max-w-md flex flex-col gap-y-8 mx-auto min-h-dvh py-12">
			<button
				type="button"
				onClick={() => {
					handleClick('level4debug');
					logger.debug('It is a truth universally acknowledged');
				}}
				className="bg-purple-300 hover:bg-purple-400 active:bg-purple-500 transition-colors duration-300 py-2 px-1 rounded-lg text-xl font-medium"
			>
				Debug
			</button>
			<button
				type="button"
				onClick={() => {
					handleClick('level3info');
					logger.info('It is a truth universally acknowledged');
				}}
				className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 transition-colors duration-300 py-2 px-1 rounded-lg text-xl font-medium"
			>
				Info
			</button>
			<button
				type="button"
				onClick={() => {
					handleClick('level2warn');
					logger.warn('It is a truth universally acknowledged');
				}}
				className="bg-orange-300 hover:bg-orange-400 active:bg-orange-500 transition-colors duration-300 py-2 px-1 rounded-lg text-xl font-medium"
			>
				Warn
			</button>
			<button
				type="button"
				onClick={() => {
					handleClick('level1error');
					logger.error('It is a truth universally acknowledged');
				}}
				className="bg-red-300 hover:bg-red-400 active:bg-red-500 transition-colors duration-300 py-2 px-1 rounded-lg text-xl font-medium"
			>
				Error
			</button>
		</div>
	);
}
