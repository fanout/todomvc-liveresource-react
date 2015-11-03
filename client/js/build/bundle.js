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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Main).apply(this, arguments));
    }

    _createClass(Main, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(TodoApp, null),
                React.createElement(Footer, null)
            );
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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoApp).apply(this, arguments));
    }

    _createClass(TodoApp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "section",
                { className: "todoapp" },
                React.createElement(TodoAppHeader, null),
                React.createElement(TodoAppMain, null),
                React.createElement(TodoAppFooter, null)
            );
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
                React.createElement("input", { className: "new-todo", placeholder: "What needs to be done?", autofocus: true })
            );
        }
    }]);

    return TodoAppHeader;
})(React.Component);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoAppMain = (function (_React$Component) {
    _inherits(TodoAppMain, _React$Component);

    function TodoAppMain() {
        _classCallCheck(this, TodoAppMain);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoAppMain).apply(this, arguments));
    }

    _createClass(TodoAppMain, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "section",
                { className: "main" },
                React.createElement("input", { className: "toggle-all", type: "checkbox" }),
                React.createElement(
                    "label",
                    { htmlFor: "toggle-all" },
                    "Mark all as complete"
                ),
                React.createElement(
                    "ul",
                    { className: "todo-list" },
                    React.createElement(
                        "li",
                        { className: "completed" },
                        React.createElement(
                            "div",
                            { className: "view" },
                            React.createElement("input", { className: "toggle", type: "checkbox", checked: true }),
                            React.createElement(
                                "label",
                                null,
                                "Taste JavaScript"
                            ),
                            React.createElement("button", { className: "destroy" })
                        ),
                        React.createElement("input", { className: "edit", value: "Create a TodoMVC template" })
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "div",
                            { className: "view" },
                            React.createElement("input", { className: "toggle", type: "checkbox" }),
                            React.createElement(
                                "label",
                                null,
                                "Buy a unicorn"
                            ),
                            React.createElement("button", { className: "destroy" })
                        ),
                        React.createElement("input", { className: "edit", value: "Rule the web" })
                    )
                )
            );
        }
    }]);

    return TodoAppMain;
})(React.Component);