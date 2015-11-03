"use strict";

var Footer = function Footer() {
    return React.createElement(
        "footer",
        { className: "info" },
        React.createElement(
            "p",
            null,
            "Double-click to edit a todo"
        ),
        React.createElement(
            "p",
            null,
            "Created by ",
            React.createElement(
                "a",
                { href: "http://fanout.io/" },
                "Fanout"
            )
        ),
        React.createElement(
            "p",
            null,
            "Part of ",
            React.createElement(
                "a",
                { href: "http://todomvc.com" },
                "TodoMVC"
            )
        )
    );
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Main = (function (_React$Component) {
    _inherits(Main, _React$Component);

    function Main() {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Main).call(this));

        _this._todoApp = null;
        return _this;
    }

    _createClass(Main, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(TodoApp, { ref: function ref(c) {
                        return _this2._todoApp = c;
                    } }),
                React.createElement(Footer, null)
            );
        }
    }, {
        key: "getTodoApp",
        value: function getTodoApp() {
            return this._todoApp;
        }
    }]);

    return Main;
})(React.Component);

Main.defaultProps = {};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoApp = (function (_React$Component) {
    _inherits(TodoApp, _React$Component);

    function TodoApp() {
        _classCallCheck(this, TodoApp);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TodoApp).call(this));

        _this.state = {
            todoItems: []
        };
        return _this;
    }

    _createClass(TodoApp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "section",
                { className: "todoapp" },
                React.createElement(TodoAppHeader, { app: this }),
                React.createElement(TodoAppMain, { app: this, todoItems: this.state.todoItems }),
                React.createElement(TodoAppFooter, null)
            );
        }
    }, {
        key: "addItems",
        value: function addItems(data) {
            var todoItems = this.state.todoItems.concat(data);
            this.setState({ todoItems: todoItems });
        }
    }, {
        key: "addTodo",
        value: function addTodo(text) {
            console.log("add text: " + text);
        }
    }, {
        key: "updateTodo",
        value: function updateTodo(id, text, completed) {
            console.log("update id: " + id + " text: " + text + " completed: " + completed);
        }
    }, {
        key: "destroyTodo",
        value: function destroyTodo(id) {
            console.log("destroy " + id);
        }
    }, {
        key: "toggleAll",
        value: function toggleAll() {
            console.log("Toggle All Clicked!");
        }
    }]);

    return TodoApp;
})(React.Component);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoAppFooter = (function (_React$Component) {
    _inherits(TodoAppFooter, _React$Component);

    function TodoAppFooter() {
        _classCallCheck(this, TodoAppFooter);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoAppFooter).apply(this, arguments));
    }

    _createClass(TodoAppFooter, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "footer",
                { className: "footer" },
                React.createElement(
                    "span",
                    { className: "todo-count" },
                    React.createElement(
                        "strong",
                        null,
                        "0"
                    ),
                    " item left"
                ),
                React.createElement(
                    "ul",
                    { className: "filters" },
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { className: "selected", href: "#/" },
                            "All"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "#/active" },
                            "Active"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: "#/completed" },
                            "Completed"
                        )
                    )
                ),
                React.createElement(
                    "button",
                    { className: "clear-completed" },
                    "Clear completed"
                )
            );
        }
    }]);

    return TodoAppFooter;
})(React.Component);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoAppHeader = (function (_React$Component) {
    _inherits(TodoAppHeader, _React$Component);

    function TodoAppHeader() {
        _classCallCheck(this, TodoAppHeader);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoAppHeader).apply(this, arguments));
    }

    _createClass(TodoAppHeader, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "header",
                { className: "header" },
                React.createElement(
                    "h1",
                    null,
                    "todos"
                ),
                React.createElement("input", { className: "new-todo", placeholder: "What needs to be done?", autofocus: true, onChange: this.onChange.bind(this) })
            );
        }
    }, {
        key: "onChange",
        value: function onChange(event) {
            this.props.app.addTodo(event.target.value);
        }
    }]);

    return TodoAppHeader;
})(React.Component);

TodoAppHeader.defaultProps = {
    app: null
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoAppMain = (function (_React$Component) {
    _inherits(TodoAppMain, _React$Component);

    function TodoAppMain(props) {
        _classCallCheck(this, TodoAppMain);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoAppMain).call(this, props));
    }

    _createClass(TodoAppMain, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            /* This section should be hidden by default and shown when there are todos */
            if (this.props.todoItems.length == 0) {
                return null;
            }
            return React.createElement(
                "section",
                { className: "main" },
                React.createElement("input", { className: "toggle-all", type: "checkbox", onClick: this.onToggleAll.bind(this) }),
                React.createElement(
                    "label",
                    { htmlFor: "toggle-all" },
                    "Mark all as complete"
                ),
                React.createElement(
                    "ul",
                    { className: "todo-list" },
                    this.props.todoItems.map(function (todoItem) {
                        return React.createElement(TodoItem, { app: _this2.props.app, key: todoItem.id, id: todoItem.id, text: todoItem.text, completed: todoItem.completed });
                    })
                )
            );
        }
    }, {
        key: "onToggleAll",
        value: function onToggleAll() {
            this.props.app.toggleAll();
        }
    }]);

    return TodoAppMain;
})(React.Component);

TodoAppMain.defaultProps = {
    app: null
};
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoItem = (function (_React$Component) {
    _inherits(TodoItem, _React$Component);

    function TodoItem(props) {
        _classCallCheck(this, TodoItem);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TodoItem).call(this, props));

        _this.state = {
            'editing': false
        };
        return _this;
    }

    _createClass(TodoItem, [{
        key: "buildClassNames",
        value: function buildClassNames() {
            var items = [];
            if (this.props.completed) {
                items.push("completed");
            }
            if (this.state.editing) {
                items.push("editing");
            }
            return items.length > 0 ? items.join(" ") : null;
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "li",
                { className: this.buildClassNames() },
                React.createElement(
                    "div",
                    { className: "view", onDoubleClick: this.onEdit.bind(this) },
                    React.createElement("input", { className: "toggle", type: "checkbox", checked: this.props.completed ? "checked" : null, onChange: this.onCheckbox.bind(this, !this.props.completed) }),
                    React.createElement(
                        "label",
                        null,
                        this.props.text
                    ),
                    React.createElement("button", { className: "destroy", onClick: this.onClick.bind(this) })
                ),
                React.createElement("input", { className: "edit", defaultValue: this.props.text, onBlur: this.onClose.bind(this), onkeypress: "" })
            );
        }
    }, {
        key: "onCheckbox",
        value: function onCheckbox(value) {
            this.props.app.updateTodo(this.props.id, this.props.text, value);
        }
    }, {
        key: "onClick",
        value: function onClick() {
            this.props.app.destroyTodo(this.props.id);
        }
    }, {
        key: "onEdit",
        value: function onEdit() {
            console.log("doubleclick");
            this.setState({ editing: true });
        }
    }, {
        key: "onClose",
        value: function onClose(event) {
            this.setState({ editing: false });
            this.props.app.updateTodo(this.props.id, event.target.value, this.props.completed);
        }
    }]);

    return TodoItem;
})(React.Component);

TodoItem.defaultProps = {
    completed: false,
    text: null,
    id: null,
    app: null
};