function TodoAppMain(props) {
    return (
        <section className="main">
            <input className="toggle-all" type="checkbox"
                   onClick={props.onToggleAll}
                   checked={props.activeTodosCount === 0}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {props.todoItems.map(todoItem =>
                    <TodoItem key={todoItem.id}
                              id={todoItem.id}
                              text={todoItem.text}
                              completed={todoItem.completed}
                              onUpdateTodoText={props.onUpdateTodoText}
                              onUpdateTodoComplete={props.onUpdateTodoComplete}
                              onDestroyTodo={props.onDestroyTodo}
                    />
                )}
            </ul>
        </section>
    );
};