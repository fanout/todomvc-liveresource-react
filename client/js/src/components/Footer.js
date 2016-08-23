import React from "react";

class Footer extends React.PureComponent {
    render() {
        return (
            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Created by <a href="http://fanout.io/">Fanout</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
                <p>Source on <a href="https://github.com/fanout/todomvc-liveresource-react">Github</a></p>
            </footer>
        )
    }
}

export default Footer;