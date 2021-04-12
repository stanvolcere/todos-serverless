import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
	return todoAccess.getAllTodos(userId)
}

export async function getTodo(todoId: string): Promise<TodoItem[]> {
	return todoAccess.getTodo(todoId)
}

export async function deleteTodo(todoId: string, userId: string): Promise<Boolean> {
	return todoAccess.deleteTodo(todoId, userId)
}

export async function createTodo(
	createTodoRequest: CreateTodoRequest,
	userId: string
): Promise<TodoItem> {
	const todoId = uuid.v4()

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
	return todoAccess.updateTodo(todoId, userId, updatedTodo)
}