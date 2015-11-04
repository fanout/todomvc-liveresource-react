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
                <TodoAppHeader app={this} />
                {filteredTodoItems.length > 0 ? (
                    <TodoAppMain app={this}
                                 todoItems={filteredTodoItems}
                                 activeTodosCount={activeTodosCount}
                                 onBeginEdit={this.onBeginEdit.bind(this)}
                    />
                ): null}
                {(activeTodosCount > 0 || completedTodosCount > 0) ? (
                    <TodoAppFooter app={this}
                                   mode={this.state.mode}
                                   activeTodosCount={activeTodosCount}
                                   completedTodosCount={activeTodosCount}
                                   onClearCompleted={this.onClearCompleted}
                    />
                ) : null}
            </section>
        );
    }
    addItems(data) {
        var todoItems = this.state.todoItems.concat(data);
        this.setState({todoItems});
    }
    onBeginEdit(id) {

    }

    addTodo(text) {
        console.log(`add text: ${text}`);
    }
    updateTodo(id, text, completed) {
        console.log(`update id: ${id} text: ${text} completed: ${completed}`);
    }
    destroyTodo(id) {
        console.log(`destroy ${id}`);
    }
    toggleAll() {
        console.log(`Toggle All Clicked!`);
    }
    onClearCompleted() {
        console.log(`Clear all Clicked!`)
    }
}
TodoApp.MODES = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};