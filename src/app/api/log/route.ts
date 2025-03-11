import logger from '@/library/logger'
import { type LogLevel, httpStatus } from '@/types'
import { type NextRequest, NextResponse } from 'next/server'

export interface LogPOSTbody {
	message: string
	level: LogLevel
}

export interface LogPOSTresponse {
	message: 'level missing' | 'success' | 'error'
}

export async function POST(request: NextRequest): Promise<NextResponse<LogPOSTresponse>> {
	try {
		const { level, message }: LogPOSTbody = await request.json()
		if (!level) {
			return NextResponse.json({ message: 'level missing' }, { status: httpStatus.http400badRequest })
		}

		switch (level) {
			case 'level1error':
				logger.error(message)
				break
			case 'level2warn':
				logger.warn(message)
				break
			case 'level3info':
				logger.info(message)
				break
			default:
				logger.debug(message)
		}

		return NextResponse.json({ message: 'success' }, { status: httpStatus.http200ok })
	} catch (error) {
		logger.error('api/log/route.ts error: ', error)
		return NextResponse.json({ message: 'error' }, { status: httpStatus.http500serverError })
	}
}
