import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import createLogger from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import * as Constants from "./Constants";
import * as todoUtils from "./utilities/todoUtils";

import Main from "./components/Main";
import TodoApp from "./components/TodoApp";

import rootReducer, * as fromRootReducer from "./reducers/index";
import * as fromTodo from "./reducers/todo";

class TodoAppAll extends React.PureComponent {
    render() {
        return (
            <TodoApp {...this.props} mode={Constants.TodoAppModes.ALL} />
        );
    }
}

class TodoAppActive extends React.PureComponent {
    render() {
        return (
            <TodoApp {...this.props} mode={Constants.TodoAppModes.ACTIVE} />
        );
    }
}

class TodoAppCompleted extends React.PureComponent {
    render() {
        return (
            <TodoApp {...this.props} mode={Constants.TodoAppModes.COMPLETED} />
        );
    }
}

//noinspection JSUnusedGlobalSymbols
export function init(domNode) {

    const middlewareList = [];
    middlewareList.push(createLogger());

    const enhancerFromMiddleware = applyMiddleware(...middlewareList);

    // Create the store
    const store = createStore(rootReducer, enhancerFromMiddleware);
    store.dispatch({type: "SET_OPTIONS", options: { domNode }});

    // Render!
    ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Main}>
                    <IndexRoute component={TodoAppAll} />
                    <Route path="active" component={TodoAppActive} />
                    <Route path="completed" component={TodoAppCompleted} />
                    <Route path=":listId">
                        <IndexRoute component={TodoAppAll} />
                        <Route path="active" component={TodoAppActive} />
                        <Route path="completed" component={TodoAppCompleted} />
                    </Route>
                </Route>
            </Router>
        </Provider>
    ), domNode);

    // These will hook up to ajax endpoints
    domNode.addEventListener("createTodo", async (e) => {
        const { listId, liveResourceReady, text } = e.detail;
        // console.log("createTodo");
        // console.log(text);

        const item = todoUtils.createTodo(text);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo, listId);

        store.dispatch({type: "SET_TODO_ITEMS", listId, todoItems: [...stateTodoItems, item]});

        if (liveResourceReady) {
            const endpointUrl = todoUtils.buildItemsApiEndpoint(listId);

            const response = await fetch(endpointUrl, {
                method: 'POST',
                body: JSON.stringify(Object.assign({}, item, {id: null}))
            });
            const responses = await response.json();

            const state = store.getState();
            const todo = fromRootReducer.getTodoState(state);
            const stateTodoItems = fromTodo.getTodoItems(todo, listId);

            store.dispatch({type: "SET_TODO_ITEMS", listId, todoItems: [
                ...stateTodoItems.filter(todoItem => todoItem !== item),
                Object.assign(item, { id: responses.id })
            ]});
        }
    });
    domNode.addEventListener("updateTodoText", async (e) => {
        const { listId, liveResourceReady } = e.detail;
        if (liveResourceReady) {
            const { item } = e.detail;
            const endpointUrl = todoUtils.buildItemsApiEndpoint(listId, item.id);
            // console.log("updateTodoText");
            // console.log(item);
            await fetch(endpointUrl, {
                method: 'PUT',
                body: JSON.stringify(item)
            });
        }
    });
    domNode.addEventListener("updateTodoComplete", async (e) => {
        const { listId, liveResourceReady, item } = e.detail;
        // console.log("updateTodoComplete");
        // console.log(item);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo, listId);

        const index = stateTodoItems.findIndex(todoItem => todoItem.id === item.id);

        if (index !== -1) {
            const todoItems = stateTodoItems.slice();
            todoItems[index].completed = item.completed;
            store.dispatch({type: "SET_TODO_ITEMS", listId, todoItems});
        }

        if (liveResourceReady) {
            const endpointUrl = todoUtils.buildItemsApiEndpoint(listId, item.id);

            await fetch(endpointUrl, {
                method: 'PUT',
                body: JSON.stringify(item)
            });
        }
    });
    domNode.addEventListener("destroyTodo", async (e) => {
        const { listId, liveResourceReady, id } = e.detail;
        // console.log("destroyTodo");
        // console.log(id);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo, listId);

        const todoItems = stateTodoItems.filter(item => item.id !== id);
        if (todoItems.length !== stateTodoItems.length) {
            store.dispatch({type: "SET_TODO_ITEMS", listId, todoItems});
        }

        if (liveResourceReady) {
            const endpointUrl = todoUtils.buildItemsApiEndpoint(listId, id);

            await fetch(endpointUrl, {
                method: 'DELETE',
                body: JSON.stringify({id})
            });
        }
    });
}

