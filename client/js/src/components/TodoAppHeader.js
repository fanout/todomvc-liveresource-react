import React from "react";
import * as Constants from "../Constants";

class TodoAppHeader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: ''
        };
        this._handleChange = ::this.handleChange;
        this._handleKeyDown = ::this.handleKeyDown;
    }
    render() {
        return (
            <header className="header">
                <h1>todos</h1>
                <input className="new-todo"
                       value={this.state.currentValue}
                       onChange={this._handleChange}
                       onKeyDown={this._handleKeyDown}
                       placeholder="What needs to be done?"
                       autoFocus={true} />
            </header>
        );
    }
    handleChange(event) {
        this.setState({currentValue: event.target.value});
    }
    handleKeyDown(event) {
        if (event.keyCode !== Constants.KeyCodes.ENTER_KEY) {
            return;
        }
        event.preventDefault();

        const { currentValue } = this.state;
        const val = currentValue.trim();
        if (val) {
            const { onCreateTodo } = this.props;
            if (onCreateTodo != null) {
                onCreateTodo(val);
                this.setState({currentValue: ''});
            }
        }
    }
}
TodoAppHeader.defaultProps = {
    onCreateTodo: null
};

export default TodoAppHeader;