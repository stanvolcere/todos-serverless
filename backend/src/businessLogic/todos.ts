import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

import { createLogger } from '../utils/logger'
const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
	logger.info('getting todos')
	return todoAccess.getAllTodos(userId)
}

export async function getTodo(todoId: string): Promise<TodoItem[]> {
	logger.info('getting todo')
	return todoAccess.getTodo(todoId)
}

export async function deleteTodo(todoId: string, userId: string): Promise<Boolean> {
	logger.info('deleting todo')
	return todoAccess.deleteTodo(todoId, userId)
}

export async function createTodo(
	createTodoRequest: CreateTodoRequest,
	userId: string
): Promise<TodoItem> {
	logger.info('generate unique id')
	const todoId = uuid.v4()

	logger.info('create todo')
	return await todoAccess.createTodo({
		todoId: todoId,
		userId: userId,
		name: createTodoRequest.name,
		dueDate: createTodoRequest.dueDate,
		createdAt: new Date().toISOString(),
		done: false,
		attachmentUrl: ""
	})
}

export async function updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate): Promise<Boolean> {
	logger.info('update todo')
	return todoAccess.updateTodo(todoId, userId, updatedTodo)
}