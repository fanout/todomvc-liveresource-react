function TodoAppFooter(props) {
    let itemsUnit = props.activeTodosCount == 1 ? "item" : "items";
    return (
        <footer className="footer">
            <span className="todo-count"><strong>{props.activeTodosCount}</strong> {itemsUnit} left</span>
            <ul className="filters">
                <li>
                    <a href="#/"
                       className={props.mode === TodoApp.MODES.ALL ? "selected" : null}
                    >All</a>
                </li>
                <li>
                    <a href="#/active"
                       className={props.mode === TodoApp.MODES.ACTIVE ? "selected" : null}
                    >Active</a>
                </li>
                <li>
                    <a href="#/completed"
                       className={props.mode === TodoApp.MODES.COMPLETED ? "selected" : null}
                    >Completed</a>
                </li>
            </ul>
            {props.completedTodosCount > 0 ? (
                <button
                    className="clear-completed"
                    onClick={props.app.onClearCompleted.bind(props.app)}>
                    Clear completed
                </button>
            ) : null}
        </footer>
    );
}
