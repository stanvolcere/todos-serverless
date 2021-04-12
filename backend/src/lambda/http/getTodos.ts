import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos'

import { getToken, parseUserId } from '../../auth/utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	//console.log(event)
	try {
		const authorization = event.headers.Authorization
		const token = getToken(authorization)
		const userId = parseUserId(token);
		console.log(userId)

		const todos = await getAllTodos(userId)
		console.log(todos)

		// TODO: Get all TODO items for a current user
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				items: todos
			})
		}
	} catch (err) {
		console.log(err.message);
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
