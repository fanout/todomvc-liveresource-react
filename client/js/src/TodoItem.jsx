class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'editing': false,
            'editText': props.text
        };
        this._editNode = null;
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
                <div className="view">
                    <input className="toggle" type="checkbox"
                           checked={this.props.completed ? "checked" : null}
                           onChange={this.handleCheckbox.bind(this)}/>
                    <label onDoubleClick={this.handleEdit.bind(this)}>{this.props.text}</label>
                    <button className="destroy" onClick={this.handleDestroy.bind(this)} />
                </div>
                <input className="edit"
                       value={this.state.editText}
                       ref={c => this._editNode = c}
                       onChange={this.handleChange.bind(this)}
                       onKeyDown={this.handleKeyDown.bind(this)}
                       onBlur={this.handleSubmit.bind(this)}
                />
            </li>
        );
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevState.editing && this.state.editing) {
            this._editNode.focus();
            this._editNode.setSelectionRange(node.value.length, node.value.length);
        }
    }

    handleCheckbox(value) {
        this.props.app.updateTodo(this.props.id, this.props.text, !this.props.completed);
    }

    handleEdit() {
        this.setState({editing: true});
    }
    handleChange(event) {
        if (this.state.editing) {
            this.setState({editText: event.target.value});
        }
    }
    handleKeyDown(event) {
        if (event.which === Constants.ESCAPE_KEY) {
            this.setState({editText: this.props.text});
            this.setState({editing: false});
        } else if (event.which === Constants.ENTER_KEY) {
            this.handleSubmit(event);
        }
    }
    handleSubmit(event) {
        var val = this.state.editText.trim();
        if (val) {
            this.setState({editText: val});
            this.props.app.updateTodo(this.props.id, val, this.props.completed);
        } else {
            this.props.app.destroyTodo(this.props.id);
        }
        this.setState({editing: false});
    }

    handleDestroy() {
        this.props.app.destroyTodo(this.props.id);
    }
}
TodoItem.defaultProps = {
    completed: false,
    text: null,
    id: null,
    app: null
};