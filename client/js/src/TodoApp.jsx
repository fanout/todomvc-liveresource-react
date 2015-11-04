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
                                   completedTodosCount={activeTodosCount}
                                   onClearCompleted={this.onClearCompleted.bind(this)}
                    />
                ) : null}
            </section>
        );
    }
    addItems(data) {
        var todoItems = this.state.todoItems.concat(data);
        this.setState({todoItems});
    }

    onCreateTodo(value) {
        console.log(`onCreateTodo (value: ${value})`);
    }
    onUpdateTodoText(id, text) {
        console.log(`onUpdateTodoText (id: ${id}, text: ${text})`);
    }
    onUpdateTodoComplete(id, completed) {
        console.log(`onUpdateTodoComplete (id: ${id}, completed: ${completed})`);
    }
    onDestroyTodo(id) {
        console.log(`onDestroyTodo (id: ${id})`);
    }
    onToggleAll(event) {
        var newValue = event.target.checked;
        this.state.todoItems.forEach(item => {
            this.onUpdateTodoComplete(item.id, newValue);
        });
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