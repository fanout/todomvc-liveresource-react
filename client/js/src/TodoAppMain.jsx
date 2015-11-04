function TodoAppMain(props) {
    return (
        <section className="main">
            <input className="toggle-all" type="checkbox"
                   onClick={props.app.toggleAll.bind(this)}
                   checked={props.activeTodosCount === 0}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                {props.todoItems.map(todoItem =>
                    <TodoItem app={props.app} key={todoItem.id} id={todoItem.id} text={todoItem.text} completed={todoItem.completed} />
                )}
            </ul>
        </section>
    );
};