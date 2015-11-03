class Main extends React.Component {
    constructor() {
        super();
        this._todoApp = null;
    }
    render() {
        return (
            <div>
                <TodoApp ref={c => this._todoApp = c} />
                <Footer />
            </div>
        )
    }
    getTodoApp() {
        return this._todoApp;
    }
}
Main.defaultProps = {};