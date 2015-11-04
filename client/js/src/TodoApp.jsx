class TodoApp extends React.Component {
    constructor() {
        super();
        this.state = {
            mode: TodoApp.MODES.ALL,
            todoItems: []
        };
        var router = Router({
            '/': () => this.setState({mode: TodoApp.MODES.ALL}),
            '/active': () => this.setState({mode: TodoApp.MODES.ACTIVE}),
            '/completed': () => this.setState({mode: TodoApp.MODES.COMPLETED})
        });
        router.init('/');
    }
    render() {
        var activeTodosCount = 0;
        var completedTodosCount = 0;
        var filteredTodoItems = [];

        this.state.todoItems.forEach(todoItem => {
            if (todoItem.completed) {
                completedTodosCount++;
                if (this.state.mode == TodoApp.MODES.COMPLETED ||
                    this.state.mode == TodoApp.MODES.ALL
                ) {
                    filteredTodoItems.push(todoItem);
                }
            } else {
                activeTodosCount++;
                if (this.state.mode == TodoApp.MODES.ACTIVE ||
                    this.state.mode == TodoApp.MODES.ALL
                ) {
                    filteredTodoItems.push(todoItem);
                }
            }
        });

        return (
            <section className="todoapp">
                <TodoAppHeader onCreateTodo={this.onCreateTodo.bind(this)} />
                {filteredTodoItems.length > 0 ? (
                    <TodoAppMain todoItems={filteredTodoItems}
                                 activeTodosCount={activeTodosCount}
                                 onUpdateTodoText={this.onUpdateTodoText.bind(this)}
                                 onUpdateTodoComplete={this.onUpdateTodoComplete.bind(this)}
                                 onDestroyTodo={this.onDestroyTodo.bind(this)}
                                 onToggleAll={this.onToggleAll.bind(this)}
                    />
                ): null}
                {(activeTodosCount > 0 || completedTodosCount > 0) ? (
                    <TodoAppFooter mode={this.state.mode}
                                   activeTodosCount={activeTodosCount}
                                   completedTodosCount={completedTodosCount}
                                   onClearCompleted={this.onClearCompleted.bind(this)}
                    />
                ) : null}
            </section>
        );
    }

    syncItems(data) {
        var mappedIds = [];
        var mappedItems = {};
        data.forEach(item => {
            if (item.id in mappedItems) {
                if (item.deleted) {
                    delete mappedItems[item.id];
                } else {
                    mappedItems[item.id] = item;
                }
            } else {
                mappedIds.push(item.id);
                mappedItems[item.id] = item;
            }
        });

        var todoItems = [];
        mappedIds.forEach(id => {
            if (id in mappedItems) {
                todoItems.push(mappedItems[id]);
            }
        });

        this.setState({todoItems: todoItems});
        this.forceUpdate();
    }

    createTodo(text) {
        // This is a "tentative one" to display
        // until we get official update notice
        var newItem = {
            id: null,
            text: text,
            completed: false,
            pendingSync: true
        };
        this.setState({todoItems: this.state.todoItems.concat([newItem])});
        return newItem;
    }

    addTodo(item) {
        let updatedItemsList = null;

        let pos = -1;
        for(let i = 0; i < this.state.todoItems.length; i++) {
            var todoItem = this.state.todoItems[i];
            if (item.id == todoItem.id) {
                pos = i;
                break;
            }
        }

        if (pos < 0) {
            updatedItemsList = this.state.todoItems.concat([item]);
        } else {
            if (this.state.todoItems[pos].pendingSync) {
                // If the item was pending sync then we pull it out
                // of the old location and add it to the end.
                updatedItemsList = this.state.todoItems.slice();
                updatedItemsList.splice(pos, 1);
                updatedItemsList.push(item);
            } else {
                // otherwise we update the item in place.
                updatedItemsList = this.state.todoItems.slice();
                updatedItemsList[pos] = item;
            }
        }
        if (updatedItemsList != null) {
            this.setState({todoItems: updatedItemsList});
        }
    }
    destroyTodo(id) {
        let updatedItemsList = null;

        let pos = -1;
        for(let i = 0; i < this.state.todoItems.length; i++) {
            var todoItem = this.state.todoItems[i];
            if (id == todoItem.id) {
                pos = i;
                break;
            }
        }

        if (pos >= 0) {
            updatedItemsList = this.state.todoItems.slice();
            updatedItemsList.splice(pos, 1);
        }
        if (updatedItemsList != null) {
            this.setState({todoItems: updatedItemsList});
        }
    }

    fireEvent(name, detail) {
        if (this.props.eventNode != null) {
            // create and dispatch the event
            var event = new CustomEvent(name, {detail});
            this.props.eventNode.dispatchEvent(event);
        }
    }

    onCreateTodo(text) {
        var item = this.createTodo(text);
        this.fireEvent("createTodo", {item});
    }
    onUpdateTodoText(id, text) {
        this.fireEvent("updateTodoText", {item: {id, text}});
    }
    onUpdateTodoComplete(id, completed) {
        this.fireEvent("updateTodoComplete", {item: {id, completed}});
    }
    onDestroyTodo(id) {
        this.destroyTodo(id);
        this.fireEvent("destroyTodo", {item: {id}});
    }
    onToggleAll(event) {
        var newValue = event.target.checked;
        this.state.todoItems.forEach(item => {
            this.onUpdateTodoComplete(item.id, newValue);
        });
    }

    onClearCompleted() {
        this.state.todoItems.forEach(item => {
            if (item.completed) {
                this.onDestroyTodo(item.id);
            }
        });
    }
}
TodoApp.defaultProps = {
    eventNode: null
};
TodoApp.MODES = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};