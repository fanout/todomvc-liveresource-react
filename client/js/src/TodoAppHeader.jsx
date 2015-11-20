class TodoAppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: ''
        }
    }
    render() {
        return (
            <header className="header">
                <h1>todos</h1>
                <input className="new-todo"
                       value={this.state.currentValue}
                       onChange={this.handleChange.bind(this)}
                       onKeyDown={this.handleKeyDown.bind(this)}
                       placeholder="What needs to be done?"
                       autoFocus={true} />
            </header>
        );
    }
    handleChange(event) {
        this.setState({currentValue: event.target.value});
    }
    handleKeyDown(event) {
        if (event.keyCode !== Constants.ENTER_KEY) {
            return;
        }

        event.preventDefault();

        var val = this.state.currentValue.trim();

        if (val) {
            this.props.onCreateTodo(val);
            this.setState({currentValue: ''});
        }
    }
}
TodoAppHeader.defaultProps = {
    onCreateTodo: null
};