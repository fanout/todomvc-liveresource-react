import React from "react";
import { connect } from "react-redux";

import LiveResourceInfo from "./LiveResourceInfo";
import Footer from "./Footer";
import * as fromRootReducer from "../reducers/index";
import * as todoUtils from "../utilities/todoUtils";
import * as fromTodo from "../reducers/todo";

//noinspection NpmUsedModulesInstalled
import LiveResource from "liveresource";

const useLiveResource = true;

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this._liveResource = null; // The LiveResource object
        this._listId = null; // The ID of the current LiveResource object

        this.state = { liveResourceReady: false };
    }
    componentDidMount() {
        this.manageLiveResource();
    }
    componentDidUpdate() {
        this.manageLiveResource();
    }
    manageLiveResource() {
        const { dispatch, listId } = this.props;

        if (listId !== this._listId) {
            this._listId = listId;

            if (useLiveResource) {

                if (this._liveResource != null) {
                    this._liveResource.cancel();
                }

                this.setState({liveResourceReady: false});

                const liveResourceUrl = todoUtils.buildItemsApiEndpoint(listId);

                dispatch({type: "SET_LOADING_ITEMS_MESSAGE", loadingItemsMessage: "Loading todo list items..."});
                LiveResource.options.maxLongPollDelayMsecs = 500;
                this._liveResource = new LiveResource(liveResourceUrl);

                this._liveResource.on("ready", async () => {
                    // console.log("ready");
                    const response = await fetch(liveResourceUrl);
                    const responses = await response.json();

                    const todoItems = todoUtils.syncItems(responses);
                    dispatch({type: "SET_TODO_ITEMS", listId, todoItems});
                    dispatch({type: "SET_LOADING_ITEMS_MESSAGE", loadingItemsMessage: null});

                    this.setState({liveResourceReady: true});
                });

                this._liveResource.on("child-added", dataItem => {
                    const { todo } = this.props;

                    // console.log("child-added");
                    // console.log(item);

                    const item = Object.assign({}, dataItem, { listId, id: dataItem.id });

                    const stateTodoItems = fromTodo.getTodoItems(todo, listId);

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

                    dispatch({type: "SET_TODO_ITEMS", listId, todoItems});
                });
                this._liveResource.on("child-deleted", item => {
                    const { todo } = this.props;

                    const { id } = item;
                    // console.log("child-deleted");
                    // console.log(id);

                    const stateTodoItems = fromTodo.getTodoItems(todo, listId);

                    const todoItems = stateTodoItems.filter(item => item.id !== id);
                    if (todoItems.length !== stateTodoItems.length) {
                        dispatch({type: "SET_TODO_ITEMS", listId, todoItems});
                    }
                });

            }
        }
    }
    render() {
        const { listId, listIdLiteral, children } = this.props;
        const { liveResourceReady } = this.state;
        const endpointUrl = todoUtils.buildItemsApiEndpoint(listId);

        return (
            <div>
                <LiveResourceInfo endpointUrl={endpointUrl} />
                    {React.Children.map(children, child =>
                        React.cloneElement(child, {listId, listIdLiteral, liveResourceReady}))}
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const { listId: listIdLiteral, listId = "default" } = ownProps.params;

    return {
        todo: fromRootReducer.getTodoState(state),
        options: fromRootReducer.getOptionsState(state),
        listId,
        listIdLiteral,
        children: ownProps.children
    };
}

export default connect(mapStateToProps)(Main);