import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUploadUrl } from '../../s3/UploadUrl';

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const todoId = event.pathParameters.todoId

		logger.info('getting presigned url for todo with id' + todoId)
		const presignedURL = getUploadUrl(todoId)

		// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				message: presignedURL
			})
		}
	} catch (err) {
		logger.error(err.message)
		// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				message: err.message
			})
		}
	}
}
