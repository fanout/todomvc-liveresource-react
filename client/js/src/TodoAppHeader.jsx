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
                       onChange={this.onChange.bind(this)}
                       onKeyDown={this.onKeyDown.bind(this)}
                       placeholder="What needs to be done?"
                       autofocus={true} />
            </header>
        );
    }
    onChange(event) {
        this.setState({currentValue: event.target.value});
    }
    onKeyDown(event) {
        if (event.keyCode !== Constants.ENTER_KEY) {
            return;
        }

        event.preventDefault();

        var val = this.state.currentValue.trim();

        if (val) {
            this.props.app.addTodo(val);
            this.setState({currentValue: ''});
        }
    }
}
TodoAppHeader.defaultProps = {
    app: null
};