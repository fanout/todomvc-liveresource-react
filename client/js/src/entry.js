import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { createStore } from "redux";
import { Provider } from "react-redux";

//noinspection NpmUsedModulesInstalled
import LiveResource from "liveresource";

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

    let endpointUrl = Constants.API_ENDPOINT;

    const currentHostname = window.location.hostname;
    const domainRegex = /todomvc\.(.*)\.org$/;
    const result = domainRegex.exec(currentHostname);
    if (result != null && result.length > 2) {
        endpointUrl = `http://todomvc-api.${result[1]}.org/todos/`;
    }

    // Create the store
    const store = createStore(rootReducer);
    store.dispatch({type: "SET_OPTIONS", options: { endpointUrl, domNode }});

    // Render!
    ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Main}>
                    <IndexRoute component={TodoAppAll} />
                    <Route path="active" component={TodoAppActive} />
                    <Route path="completed" component={TodoAppCompleted} />
                </Route>
            </Router>
        </Provider>
    ), domNode);

    const useLiveResource = true;

    let liveResourceReady = false;

    if (useLiveResource) {

        store.dispatch({type: "SET_LOADING_ITEMS_MESSAGE", loadingItemsMessage: "Loading todo list items..."});

        LiveResource.options.maxLongPollDelayMsecs = 500;

        var liveResource = new LiveResource(endpointUrl);
        liveResource.on("ready", async () => {
            // console.log("ready");
            const response = await fetch(endpointUrl);
            const responses = await response.json();

            const todoItems = todoUtils.syncItems(responses);
            store.dispatch({type: "SET_TODO_ITEMS", todoItems});
            store.dispatch({type: "SET_LOADING_ITEMS_MESSAGE", loadingItemsMessage: null});
            liveResourceReady = true;
        });
        liveResource.on("child-added", dataItem => {
            // console.log("child-added");
            // console.log(item);

            const item = Object.assign({}, dataItem, { id: dataItem.id });

            const state = store.getState();
            const todo = fromRootReducer.getTodoState(state);
            const stateTodoItems = fromTodo.getTodoItems(todo);

            const index = stateTodoItems.findIndex(todoItem => todoItem.id === item.id);

            let todoItems;

            if (index < 0) {
                todoItems = [...stateTodoItems, item];
            } else {
                if (stateTodoItems[index].pendingSync) {
                    // If the item was pending sync then we pull it out
                    // of the old location and add it to the end.
                    todoItems = [
                        ...stateTodoItems.slice(0, index),
                        ...stateTodoItems.slice(index + 1),
                        item
                    ]
                } else {
                    todoItems = [
                        ...stateTodoItems.slice(0, index),
                        item,
                        ...stateTodoItems.slice(index + 1)
                    ]
                }
            }

            store.dispatch({type: "SET_TODO_ITEMS", todoItems});
        });
        liveResource.on("child-deleted", item => {
            const { id } = item;
            // console.log("child-deleted");
            // console.log(id);

            const state = store.getState();
            const todo = fromRootReducer.getTodoState(state);
            const stateTodoItems = fromTodo.getTodoItems(todo);

            const todoItems = stateTodoItems.filter(item => item.id !== id);
            if (todoItems.length !== stateTodoItems.length) {
                store.dispatch({type: "SET_TODO_ITEMS", todoItems});
            }
        });
    }

    // These will hook up to ajax endpoints
    domNode.addEventListener("createTodo", async (e) => {
        const { text } = e.detail;
        // console.log("createTodo");
        // console.log(text);

        const item = todoUtils.createTodo(text);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo);

        store.dispatch({type: "SET_TODO_ITEMS", todoItems: [...stateTodoItems, item]});

        if (liveResourceReady) {
            const response = await fetch(endpointUrl, {
                method: 'POST',
                body: JSON.stringify(Object.assign({}, item, {id: null}))
            });
            const responses = await response.json();

            const state = store.getState();
            const todo = fromRootReducer.getTodoState(state);
            const stateTodoItems = fromTodo.getTodoItems(todo);

            store.dispatch({type: "SET_TODO_ITEMS", todoItems: [
                ...stateTodoItems.filter(todoItem => todoItem !== item),
                Object.assign(item, { id: responses.id })
            ]});
        }
    });
    domNode.addEventListener("updateTodoText", async (e) => {
        if (liveResourceReady) {
            const { item } = e.detail;
            // console.log("updateTodoText");
            // console.log(item);
            await fetch(`${endpointUrl}${item.id}/`, {
                method: 'PUT',
                body: JSON.stringify(item)
            });
        }
    });
    domNode.addEventListener("updateTodoComplete", async (e) => {
        const { item } = e.detail;
        // console.log("updateTodoComplete");
        // console.log(item);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo);

        const index = stateTodoItems.findIndex(todoItem => todoItem.id === item.id);

        if (index !== -1) {
            const todoItems = stateTodoItems.slice();
            todoItems[index].completed = item.completed;
            store.dispatch({type: "SET_TODO_ITEMS", todoItems});
        }

        if (liveResourceReady) {
            await fetch(`${endpointUrl}${item.id}/`, {
                method: 'PUT',
                body: JSON.stringify(item)
            });
        }
    });
    domNode.addEventListener("destroyTodo", async (e) => {
        const { id } = e.detail;
        // console.log("destroyTodo");
        // console.log(id);

        const state = store.getState();
        const todo = fromRootReducer.getTodoState(state);
        const stateTodoItems = fromTodo.getTodoItems(todo);

        const todoItems = stateTodoItems.filter(item => item.id !== id);
        if (todoItems.length !== stateTodoItems.length) {
            store.dispatch({type: "SET_TODO_ITEMS", todoItems});
        }

        if (liveResourceReady) {
            await fetch(`${endpointUrl}${id}/`, {
                method: 'DELETE',
                body: JSON.stringify({id})
            });
        }
    });
}

