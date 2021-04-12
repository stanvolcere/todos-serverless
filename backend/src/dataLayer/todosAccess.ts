import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'
const logger = createLogger('todosAccess')

const XAWS = AWSXRay.captureAWS(AWS)

const userIdIndex = process.env.USER_ID_INDEX;

export class TodoAccess {


	constructor(
		private readonly docClient: DocumentClient = createDynamoDBClient(),
		private readonly todosTable = process.env.TODOS_TABLE) {
	}

	async getAllTodos(userId: string): Promise<TodoItem[]> {
		logger.info('get all todos for user' + userId)
		const result = await this.docClient.query({
			TableName: this.todosTable,
			IndexName: userIdIndex,
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				':userId': userId
			}
		}).promise()

		const items = result.Items
		if (items.length > 0) {
			return items as TodoItem[]
		}
		return [];
	}

	async getTodo(todoId: string): Promise<TodoItem[]> {
		logger.info('get todo')

		const result = await this.docClient.query({
			TableName: this.todosTable,
			KeyConditionExpression: 'todoId = :todoId',
			ExpressionAttributeValues: {
				':todoId': todoId,
			}
		}).promise()

		const items = result.Items
		return items as TodoItem[]
	}

	async createTodo(todo: TodoItem): Promise<TodoItem> {
		logger.info('delete todo for user')
		await this.docClient.put({
			TableName: this.todosTable,
			Item: todo
		}).promise()

		return todo
	}

	async deleteTodo(todoId: string, userId: string): Promise<Boolean> {
		logger.info('delete todo for user' + userId)

		await this.docClient.delete({
			TableName: this.todosTable,
			Key: {
				"todoId": todoId,
				"userId": userId,
			}
		}).promise()

		return true;
	}

	async updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate): Promise<Boolean> {
		logger.info('update todo for user ' + userId)
		await this.docClient.update({
			TableName: this.todosTable,
			Key: {
				"todoId": todoId,
				"userId": userId
			},
			UpdateExpression: "SET attachmentUrl = :attachmentUrl, #n = :name, dueDate = :dueDate, done = :done",
			ExpressionAttributeValues: {
				":attachmentUrl": updatedTodo.attachmentUrl,
				":name": updatedTodo.name,
				":dueDate": updatedTodo.dueDate,
				":done": updatedTodo.done
			},
			ExpressionAttributeNames: {
				"#n": "name"
			}
		}).promise()

		return true;
	}
}

function createDynamoDBClient() {
	if (process.env.IS_OFFLINE) {
		logger.info('Creating a local DynamoDB instance')
		return new XAWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000'
		})
	}

	logger.info('return DynamoDB instance')
	return new XAWS.DynamoDB.DocumentClient()
}