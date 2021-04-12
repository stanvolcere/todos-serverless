import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getToken, parseUserId } from '../../auth/utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const todoId = event.pathParameters.todoId
		const authorization = event.headers.Authorization
		const token = getToken(authorization)
		const userId = parseUserId(token)

		await deleteTodo(todoId, userId)

		// TODO: Remove a TODO item by id
		return {
			statusCode: 204,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				message: "todo deleted"
			})
		}
	} catch (err) {
		console.log(err);
		if (err.errorCode === 401) {
			return {
				statusCode: err.errorCode,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: JSON.stringify({
					message: err.message
				})
			}
		}
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
