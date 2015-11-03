class TodoApp extends React.Component {
    constructor() {
        super();
        this.state = {
            todoItems: []
        };
    }
    render() {
        return (
            <section className="todoapp">
                <TodoAppHeader app={this} />
                <TodoAppMain app={this} todoItems={this.state.todoItems} />
                <TodoAppFooter />
            </section>
        );
    }
    addItems(data) {
        var todoItems = this.state.todoItems.concat(data);
        this.setState({todoItems});
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
}
