import React from "react";
import { connect } from "react-redux";

import TodoAppHeader from "./TodoAppHeader";
import TodoAppMain from "./TodoAppMain";
import TodoAppFooter from "./TodoAppFooter";

import * as Constants from "../Constants";
import * as fromRootReducer from "../reducers/index";
import * as fromTodoReducer from "../reducers/todo";
import * as fromOptions from "../reducers/options";

class TodoApp extends React.PureComponent {
    constructor(props) {
        super(props);
        this._handleCreateTodo = ::this.handleCreateTodo;
        this._handleUpdateTodoText = ::this.handleUpdateTodoText;
        this._handleUpdateTodoComplete = ::this.handleUpdateTodoComplete;
        this._handleDestroyTodo = ::this.handleDestroyTodo;
        this._handleToggleAll = ::this.handleToggleAll;
        this._handleClearCompleted = ::this.handleClearCompleted;
    }
    render() {
        const { listId, listIdLiteral, mode, todoState } = this.props;

        const todoItems = fromTodoReducer.getTodoItems(todoState, listId);
        const loadingItemsMessage = fromTodoReducer.getLoadingItemsMessage(todoState);

        const filteredTodoItems = [];
        let activeTodosCount = 0;
        let completedTodosCount = 0;
        todoItems.forEach(todoItem => {
            if (todoItem.completed) {
                completedTodosCount++;
                if (mode === Constants.TodoAppModes.COMPLETED ||
                    mode === Constants.TodoAppModes.ALL
                ) {
                    filteredTodoItems.push(todoItem);
                }
            } else {
                activeTodosCount++;
                if (mode === Constants.TodoAppModes.ACTIVE ||
                    mode === Constants.TodoAppModes.ALL
                ) {
                    filteredTodoItems.push(todoItem);
                }
            }
        });

        return (
            <section className="todoapp">
                <TodoAppHeader onCreateTodo={this._handleCreateTodo} />
                {loadingItemsMessage != null ? (
                    <div className="pa1 tc">{loadingItemsMessage}</div>
                ) : null}
                {filteredTodoItems.length > 0 ? (
                    <TodoAppMain todoItems={filteredTodoItems}
                                 activeTodosCount={activeTodosCount}
                                 onUpdateTodoText={this._handleUpdateTodoText}
                                 onUpdateTodoComplete={this._handleUpdateTodoComplete}
                                 onDestroyTodo={this._handleDestroyTodo}
                                 onToggleAll={this._handleToggleAll}
                    />
                ): null}
                {(activeTodosCount > 0 || completedTodosCount > 0) ? (
                    <TodoAppFooter listId={listIdLiteral}
                                   mode={mode}
                                   activeTodosCount={activeTodosCount}
                                   completedTodosCount={completedTodosCount}
                                   onClearCompleted={this._handleClearCompleted}
                    />
                ) : null}
            </section>
        );
    }

    fireEvent(name, data) {
        const { listId, liveResourceReady, optionsState } = this.props;
        const options = fromOptions.getOptions(optionsState);
        const { domNode } = options;

        if (domNode != null) {
            // create and dispatch the event
            const detail = Object.assign({}, data, {listId, liveResourceReady});
            const event = new CustomEvent(name, {detail});
            domNode.dispatchEvent(event);
        }
    }

    handleCreateTodo(text) {
        this.fireEvent("createTodo", {text});
    }
    handleUpdateTodoText(id, text) {
        this.fireEvent("updateTodoText", {item: {id, text}});
    }
    handleUpdateTodoComplete(id, completed) {
        this.fireEvent("updateTodoComplete", {item: {id, completed}});
    }
    handleDestroyTodo(id) {
        this.fireEvent("destroyTodo", {id});
    }
    handleToggleAll(event) {
        const { listId, todoState } = this.props;
        const todoItems = fromTodoReducer.getTodoItems(todoState, listId);

        const newValue = event.target.checked;
        todoItems.forEach(item => {
            this.handleUpdateTodoComplete(item.id, newValue);
        });
    }
    handleClearCompleted() {
        const { listId, todoState } = this.props;
        const todoItems = fromTodoReducer.getTodoItems(todoState, listId);

        todoItems.forEach(item => {
            if (item.completed) {
                this.handleDestroyTodo(item.id);
            }
        });
    }
}

function mapStateToProps(state, ownProps) {
    return {
        optionsState: fromRootReducer.getOptionsState(state),
        todoState: fromRootReducer.getTodoState(state),
        mode: ownProps.mode,
        listId: ownProps.listId,
        liveResourceReady: ownProps.liveResourceReady
    };
}

export default connect(mapStateToProps)(TodoApp);
