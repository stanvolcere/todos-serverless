import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodo, updateTodo } from '../../businessLogic/todos'
import { getToken, parseUserId } from '../../auth/utils';

import { createLogger } from '../../utils/logger'
const logger = createLogger('attachFileToTodoLambda')

const imageBucketName = process.env.IMAGES_S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const todoId = event.pathParameters.todoId
		const authorization = event.headers.Authorization

		logger.info("Authenticating user")
		const token = getToken(authorization)
		const userId = parseUserId(token)

		logger.info("Getting todo")
		const todos = await getTodo(todoId);

		logger.info("Verifying todo")
		if (todos.length > 0) {
			if (todos[0].userId !== userId) {
				throw new Error('401')
			}
		} else {
			throw new Error('404')
		}

		logger.info("Updating todo")
		// update the todo with new image attach
		const updatedTodo = { ...todos[0], attachmentUrl: `https://${imageBucketName}.s3.eu-west-2.amazonaws.com/${todoId}` }
		await updateTodo(todoId, userId, updatedTodo)

		logger.info("Updating todo complete")
		// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
		return {
			statusCode: 204,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				message: "attachment added to " + todoId
			})
		}
	} catch (err) {
		logger.error(err.message);
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

