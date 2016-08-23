import React from "react";
import { Link } from "react-router";

import * as Constants from "../Constants";

class TodoAppFooter extends React.PureComponent {
    render() {
        const { mode, activeTodosCount, completedTodosCount, onClearCompleted } = this.props;

        const itemsUnit = activeTodosCount == 1 ? "item" : "items";
        return (
            <footer className="footer">
                <span className="todo-count"><strong>{activeTodosCount}</strong> {itemsUnit} left</span>
                <ul className="filters">
                    <li>
                        <Link to="/"
                              className={mode === Constants.TodoAppModes.ALL ? "selected" : null}
                        >All</Link>
                    </li>
                    <li>
                        <Link to="/active"
                           className={mode === Constants.TodoAppModes.ACTIVE ? "selected" : null}
                        >Active</Link>
                    </li>
                    <li>
                        <Link to="/completed"
                           className={mode === Constants.TodoAppModes.COMPLETED ? "selected" : null}
                        >Completed</Link>
                    </li>
                </ul>
                {completedTodosCount > 0 ? (
                    <button
                        className="clear-completed"
                        onClick={onClearCompleted}>
                        Clear completed
                    </button>
                ) : null}
            </footer>
        );
    }
}

export default TodoAppFooter;
