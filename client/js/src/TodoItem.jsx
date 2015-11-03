class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'editing': false
        };
    }
    buildClassNames() {
        var items = [];
        if (this.props.completed) {
            items.push("completed");
        }
        if (this.state.editing) {
            items.push("editing");
        }
        return items.length > 0 ? items.join(" ") : null;
    }
    render() {
        return (
            <li className={this.buildClassNames()}>
                <div className="view" onDoubleClick={this.onEdit.bind(this)}>
                    <input className="toggle" type="checkbox" checked={this.props.completed ? "checked" : null} onChange={this.onCheckbox.bind(this, !this.props.completed)}/>
                    <label>{this.props.text}</label>
                    <button className="destroy" onClick={this.onClick.bind(this)} />
                </div>
                <input className="edit" defaultValue={this.props.text} onBlur={this.onClose.bind(this)} onkeypress=""/>
            </li>
        );
    }
    onCheckbox(value) {
        this.props.app.updateTodo(this.props.id, this.props.text, value);
    }
    onClick() {
        this.props.app.destroyTodo(this.props.id);
    }
    onEdit() {
        console.log("doubleclick");
        this.setState({editing: true});
    }
    onClose(event) {
        this.setState({editing: false});
        this.props.app.updateTodo(this.props.id, event.target.value, this.props.completed);
    }
}
TodoItem.defaultProps = {
    completed: false,
    text: null,
    id: null,
    app: null
};