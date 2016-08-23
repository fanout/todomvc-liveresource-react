import React from "react";

import TodoItem from "./TodoItem";

class TodoAppMain extends React.PureComponent {
    render() {
        const { activeTodosCount, todoItems, onToggleAll, onUpdateTodoText, onUpdateTodoComplete, onDestroyTodo } = this.props;

        return (
            <section className="main">
                <input className="toggle-all" type="checkbox"
                       onClick={onToggleAll}
                       checked={activeTodosCount === 0}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">
                    {todoItems.map(todoItem =>
                        <TodoItem key={todoItem.id}
                                  id={todoItem.id}
                                  text={todoItem.text}
                                  completed={todoItem.completed}
                                  onUpdateTodoText={onUpdateTodoText}
                                  onUpdateTodoComplete={onUpdateTodoComplete}
                                  onDestroyTodo={onDestroyTodo}
                        />
                    )}
                </ul>
            </section>
        );
    }
}

export default TodoAppMain;
