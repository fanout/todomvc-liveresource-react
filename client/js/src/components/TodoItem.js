import React from "react";

import * as Constants from "../Constants";

class TodoItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            'editing': false,
            'editText': props.text
        };
        this._editNode = null;

        this._handleCheckbox = ::this.handleCheckbox;
        this._handleEdit = ::this.handleEdit;
        this._handleDestroy = ::this.handleDestroy;

        this._handleChange = ::this.handleChange;
        this._handleKeyDown = ::this.handleKeyDown;
        this._handleSubmit = ::this.handleSubmit;
    }
    render() {
        const { completed, text } = this.props;
        const { editing, editText } = this.state;

        const classes = [];
        if (completed) {
            classes.push("completed");
        }
        if (editing) {
            classes.push("editing");
        }

        return (
            <li className={classes.join(" ")}>
                <div className="view">
                    <input className="toggle" type="checkbox"
                           checked={completed}
                           onChange={this._handleCheckbox}/>
                    <label onDoubleClick={this._handleEdit}>{text}</label>
                    <button className="destroy" onClick={this._handleDestroy} />
                </div>
                <input className="edit"
                       value={editText}
                       ref={c => this._editNode = c}
                       onChange={this._handleChange}
                       onKeyDown={this._handleKeyDown}
                       onBlur={this._handleSubmit}
                />
            </li>
        );
    }
    componentDidUpdate(prevProps, prevState) {
        const { editing: prevEditing } = prevState;
        const { editing } = this.state;

        if (!prevEditing && editing) {
            this._editNode.focus();
            this._editNode.setSelectionRange(this._editNode.value.length, this._editNode.value.length);
        }
    }

    handleCheckbox(event) {
        const { id, onUpdateTodoComplete } = this.props;

        if (onUpdateTodoComplete != null) {
            onUpdateTodoComplete(id, event.target.checked);
        }
    }

    handleEdit() {
        this.setState({editing: true});
    }
    handleChange(event) {
        const { editing } = this.state;

        if (editing) {
            this.setState({editText: event.target.value});
        }
    }
    handleKeyDown(event) {
        if (event.which === Constants.KeyCodes.ESCAPE_KEY) {
            const { text } = this.props;
            this.setState({editText: text, editing: false});
        } else if (event.which === Constants.KeyCodes.ENTER_KEY) {
            this.handleSubmit(event);
        }
    }
    handleSubmit(event) {
        const { id, onUpdateTodoText, onDestroyTodo } = this.props;
        const { editText } = this.state;
        const val = editText.trim();
        if (val) {
            this.setState({editText: val});
            if (onUpdateTodoText != null) {
                onUpdateTodoText(id, val);
            }
        } else {
            if (onDestroyTodo != null) {
                onDestroyTodo(id);
            }
        }
        this.setState({editing: false});
    }

    handleDestroy() {
        const { id, onDestroyTodo } = this.props;
        if (onDestroyTodo != null) {
            onDestroyTodo(id);
        }
    }
}
TodoItem.defaultProps = {
    completed: false,
    text: null,
    id: null,
    onUpdateTodoText: null,
    onUpdateTodoComplete: null,
    onDestroyTodo: null
};

export default TodoItem;