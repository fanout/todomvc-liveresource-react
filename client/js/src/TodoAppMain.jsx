class TodoAppMain extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        /* This section should be hidden by default and shown when there are todos */
        if(this.props.todoItems.length == 0) {
            return null;
        }
        return (
            <section className="main">
                <input className="toggle-all" type="checkbox" onClick={this.onToggleAll.bind(this)} />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">
                    {this.props.todoItems.map(todoItem =>
                        <TodoItem app={this.props.app} key={todoItem.id} id={todoItem.id} text={todoItem.text} completed={todoItem.completed} />
                    )}
                </ul>
            </section>
        );
    }
    onToggleAll() {
        this.props.app.toggleAll();
    }
}
TodoAppMain.defaultProps = {
    app: null
};