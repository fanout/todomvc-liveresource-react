class Main extends React.Component {
    constructor(props) {
        super(props);
        this._todoApp = null;
    }
    render() {
        return (
            <div>
                <TodoApp eventNode={this.props.eventNode} loadingItemsMessage={this.props.loadingItemsMessage} ref={c => this._todoApp = c} />
                <Footer />
            </div>
        )
    }
    getTodoApp() {
        return this._todoApp;
    }
}
Main.defaultProps = {
    eventNode: null,
    loadingItemsMessage: null,
};