// LICENSE : MIT
"use strict";
const assert = require("assert");
import MemoryDB from "../../lib/infra/adpter/MemoryDB";
import TodoList from "../../lib/domain/TodoList/TodoList";
import TodoItem from "../../lib/domain/TodoList/TodoItem";
import { TodoListRepository } from "../../lib/infra/TodoListRepository";
import { UpdateTodoItemTitleUseCase } from "../../lib/usecase/UpdateTodoItemTitle";
describe("UpdateTodoItem", function () {
    it("should update TodoItem with title", function (done) {
        const mockTodoList = new TodoList();
        const existTodoItem = new TodoItem({ title: "before" });
        mockTodoList.addItem(existTodoItem);
        // prepare
        const todoListRepository = new TodoListRepository(new MemoryDB());
        todoListRepository.save(mockTodoList);
        // initialize
        const useCase = new UpdateTodoItemTitleUseCase({
            todoListRepository
        });
        const titleOfUPDATING = "UPDATING TODO";
        // Then
        todoListRepository.onChange(() => {
            // re-get todoList
            const storedTodoList = todoListRepository.find(mockTodoList);
            const todoItem = storedTodoList.getItem(existTodoItem.id);
            assert(todoItem);
            assert.equal(todoItem.title, titleOfUPDATING);
            done();
        });
        // When
        useCase.execute({ id: existTodoItem.id, title: titleOfUPDATING });
    });
});
