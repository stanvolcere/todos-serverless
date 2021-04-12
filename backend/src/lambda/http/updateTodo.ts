import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { getToken, parseUserId } from '../../auth/utils';

import { getTodo, updateTodo } from '../../businessLogic/todos';

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const todoId = event.pathParameters.todoId
		// Update related
		const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

		// Auth related
		logger.info('authurising user');
		const authorization = event.headers.Authorization
		const token = getToken(authorization)
		const userId = parseUserId(token)

		// get the item from db
		logger.info('get todo');
		const todos = await getTodo(todoId);

		logger.info('verify todo ownership');
		if (todos.length > 0) {
			if (todos[0].userId !== userId) {
				throw new Error('401')
			}
		} else {
			throw new Error('404')
		}

		const todo = { ...todos[0], ...updatedTodo }

		logger.info('updating todo');
		await updateTodo(todoId, userId, todo);

		// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
		return {
			statusCode: 204,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({
				message: "Updated" + todoId + updatedTodo.name
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
