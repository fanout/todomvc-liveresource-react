class TodoAppHeader extends React.Component {
    render() {
        return (
            <header className="header">
                <h1>todos</h1>
                <input className="new-todo" placeholder="What needs to be done?" autofocus onChange={this.onChange.bind(this)} />
            </header>
        );
    }
    onChange(event) {
        this.props.app.addTodo(event.target.value);
    }
}
TodoAppHeader.defaultProps = {
    app: null
};