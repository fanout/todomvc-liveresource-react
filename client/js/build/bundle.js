"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = function Constants() {
  _classCallCheck(this, Constants);
};

Constants.ENTER_KEY = 13;
Constants.ESCAPE_KEY = 27;
"use strict";

try {
    new CustomEvent("test");
} catch (e) {
    var CustomEvent = function CustomEvent(event, params) {
        var evt;
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
}
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

    function Main(props) {
        _classCallCheck(this, Main);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Main).call(this, props));

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
                React.createElement(TodoApp, { eventNode: this.props.eventNode, loadingItemsMessage: this.props.loadingItemsMessage, ref: function ref(c) {
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

Main.defaultProps = {
    eventNode: null,
    loadingItemsMessage: null
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoApp = (function (_React$Component) {
    _inherits(TodoApp, _React$Component);

    function TodoApp(props) {
        _classCallCheck(this, TodoApp);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TodoApp).call(this, props));

        _this.state = {
            mode: TodoApp.MODES.ALL,
            todoItems: [],
            loadingItemsMessage: props.loadingItemsMessage
        };
        var router = Router({
            '/': function _() {
                return _this.setState({ mode: TodoApp.MODES.ALL });
            },
            '/active': function active() {
                return _this.setState({ mode: TodoApp.MODES.ACTIVE });
            },
            '/completed': function completed() {
                return _this.setState({ mode: TodoApp.MODES.COMPLETED });
            }
        });
        router.init('/');
        return _this;
    }

    _createClass(TodoApp, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var activeTodosCount = 0;
            var completedTodosCount = 0;
            var filteredTodoItems = [];

            this.state.todoItems.forEach(function (todoItem) {
                if (todoItem.completed) {
                    completedTodosCount++;
                    if (_this2.state.mode == TodoApp.MODES.COMPLETED || _this2.state.mode == TodoApp.MODES.ALL) {
                        filteredTodoItems.push(todoItem);
                    }
                } else {
                    activeTodosCount++;
                    if (_this2.state.mode == TodoApp.MODES.ACTIVE || _this2.state.mode == TodoApp.MODES.ALL) {
                        filteredTodoItems.push(todoItem);
                    }
                }
            });

            return React.createElement(
                'section',
                { className: 'todoapp' },
                React.createElement(TodoAppHeader, { onCreateTodo: this.onCreateTodo.bind(this) }),
                this.state.loadingItemsMessage != null ? React.createElement(
                    'div',
                    { className: 'loading-message' },
                    this.state.loadingItemsMessage
                ) : null,
                filteredTodoItems.length > 0 ? React.createElement(TodoAppMain, { todoItems: filteredTodoItems,
                    activeTodosCount: activeTodosCount,
                    onUpdateTodoText: this.onUpdateTodoText.bind(this),
                    onUpdateTodoComplete: this.onUpdateTodoComplete.bind(this),
                    onDestroyTodo: this.onDestroyTodo.bind(this),
                    onToggleAll: this.onToggleAll.bind(this)
                }) : null,
                activeTodosCount > 0 || completedTodosCount > 0 ? React.createElement(TodoAppFooter, { mode: this.state.mode,
                    activeTodosCount: activeTodosCount,
                    completedTodosCount: completedTodosCount,
                    onClearCompleted: this.onClearCompleted.bind(this)
                }) : null
            );
        }
    }, {
        key: 'syncItems',
        value: function syncItems(data) {
            var mappedIds = [];
            var mappedItems = {};
            data.forEach(function (item) {
                if (item.id in mappedItems) {
                    if (item.deleted) {
                        delete mappedItems[item.id];
                    } else {
                        mappedItems[item.id] = item;
                    }
                } else {
                    mappedIds.push(item.id);
                    mappedItems[item.id] = item;
                }
            });

            var todoItems = [];
            mappedIds.forEach(function (id) {
                if (id in mappedItems) {
                    todoItems.push(mappedItems[id]);
                }
            });

            this.setState({ todoItems: todoItems });
            this.forceUpdate();
        }
    }, {
        key: 'setLoadingItemsMessage',
        value: function setLoadingItemsMessage(loadingItemsMessage) {
            this.setState({ loadingItemsMessage: loadingItemsMessage });
        }
    }, {
        key: 'createTodo',
        value: function createTodo(text) {
            // This is a "tentative one" to display
            // until we get official update notice
            var newItem = {
                id: null,
                text: text,
                completed: false,
                pendingSync: true
            };
            this.setState({ todoItems: this.state.todoItems.concat([newItem]) });
            return newItem;
        }
    }, {
        key: 'addTodo',
        value: function addTodo(item) {
            var updatedItemsList = null;

            var pos = -1;
            for (var i = 0; i < this.state.todoItems.length; i++) {
                var todoItem = this.state.todoItems[i];
                if (item.id == todoItem.id) {
                    pos = i;
                    break;
                }
            }

            if (pos < 0) {
                updatedItemsList = this.state.todoItems.concat([item]);
            } else {
                if (this.state.todoItems[pos].pendingSync) {
                    // If the item was pending sync then we pull it out
                    // of the old location and add it to the end.
                    updatedItemsList = this.state.todoItems.slice();
                    updatedItemsList.splice(pos, 1);
                    updatedItemsList.push(item);
                } else {
                    // otherwise we update the item in place.
                    updatedItemsList = this.state.todoItems.slice();
                    updatedItemsList[pos] = item;
                }
            }
            if (updatedItemsList != null) {
                this.setState({ todoItems: updatedItemsList });
            }
        }
    }, {
        key: 'destroyTodo',
        value: function destroyTodo(id) {
            var updatedItemsList = null;

            var pos = -1;
            for (var i = 0; i < this.state.todoItems.length; i++) {
                var todoItem = this.state.todoItems[i];
                if (id == todoItem.id) {
                    pos = i;
                    break;
                }
            }

            if (pos >= 0) {
                updatedItemsList = this.state.todoItems.slice();
                updatedItemsList.splice(pos, 1);
            }
            if (updatedItemsList != null) {
                this.setState({ todoItems: updatedItemsList });
            }
        }
    }, {
        key: 'fireEvent',
        value: function fireEvent(name, detail) {
            if (this.props.eventNode != null) {
                // create and dispatch the event
                var event = new CustomEvent(name, { detail: detail });
                this.props.eventNode.dispatchEvent(event);
            }
        }
    }, {
        key: 'onCreateTodo',
        value: function onCreateTodo(text) {
            var item = this.createTodo(text);
            this.fireEvent("createTodo", { item: item });
        }
    }, {
        key: 'onUpdateTodoText',
        value: function onUpdateTodoText(id, text) {
            this.fireEvent("updateTodoText", { item: { id: id, text: text } });
        }
    }, {
        key: 'onUpdateTodoComplete',
        value: function onUpdateTodoComplete(id, completed) {
            this.fireEvent("updateTodoComplete", { item: { id: id, completed: completed } });
        }
    }, {
        key: 'onDestroyTodo',
        value: function onDestroyTodo(id) {
            this.destroyTodo(id);
            this.fireEvent("destroyTodo", { item: { id: id } });
        }
    }, {
        key: 'onToggleAll',
        value: function onToggleAll(event) {
            var _this3 = this;

            var newValue = event.target.checked;
            this.state.todoItems.forEach(function (item) {
                _this3.onUpdateTodoComplete(item.id, newValue);
            });
        }
    }, {
        key: 'onClearCompleted',
        value: function onClearCompleted() {
            var _this4 = this;

            this.state.todoItems.forEach(function (item) {
                if (item.completed) {
                    _this4.onDestroyTodo(item.id);
                }
            });
        }
    }]);

    return TodoApp;
})(React.Component);

TodoApp.defaultProps = {
    eventNode: null,
    loadingItemsMessage: null
};
TodoApp.MODES = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
};
"use strict";

function TodoAppFooter(props) {
    var itemsUnit = props.activeTodosCount == 1 ? "item" : "items";
    return React.createElement(
        "footer",
        { className: "footer" },
        React.createElement(
            "span",
            { className: "todo-count" },
            React.createElement(
                "strong",
                null,
                props.activeTodosCount
            ),
            " ",
            itemsUnit,
            " left"
        ),
        React.createElement(
            "ul",
            { className: "filters" },
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "#/",
                        className: props.mode === TodoApp.MODES.ALL ? "selected" : null
                    },
                    "All"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "#/active",
                        className: props.mode === TodoApp.MODES.ACTIVE ? "selected" : null
                    },
                    "Active"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "#/completed",
                        className: props.mode === TodoApp.MODES.COMPLETED ? "selected" : null
                    },
                    "Completed"
                )
            )
        ),
        props.completedTodosCount > 0 ? React.createElement(
            "button",
            {
                className: "clear-completed",
                onClick: props.onClearCompleted },
            "Clear completed"
        ) : null
    );
}
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TodoAppHeader = (function (_React$Component) {
    _inherits(TodoAppHeader, _React$Component);

    function TodoAppHeader(props) {
        _classCallCheck(this, TodoAppHeader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TodoAppHeader).call(this, props));

        _this.state = {
            currentValue: ''
        };
        return _this;
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
                React.createElement("input", { className: "new-todo",
                    value: this.state.currentValue,
                    onChange: this.handleChange.bind(this),
                    onKeyDown: this.handleKeyDown.bind(this),
                    placeholder: "What needs to be done?",
                    autofocus: true })
            );
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ currentValue: event.target.value });
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown(event) {
            if (event.keyCode !== Constants.ENTER_KEY) {
                return;
            }

            event.preventDefault();

            var val = this.state.currentValue.trim();

            if (val) {
                this.props.onCreateTodo(val);
                this.setState({ currentValue: '' });
            }
        }
    }]);

    return TodoAppHeader;
})(React.Component);

TodoAppHeader.defaultProps = {
    onCreateTodo: null
};
"use strict";

function TodoAppMain(props) {
    return React.createElement(
        "section",
        { className: "main" },
        React.createElement("input", { className: "toggle-all", type: "checkbox",
            onClick: props.onToggleAll,
            checked: props.activeTodosCount === 0
        }),
        React.createElement(
            "label",
            { htmlFor: "toggle-all" },
            "Mark all as complete"
        ),
        React.createElement(
            "ul",
            { className: "todo-list" },
            props.todoItems.map(function (todoItem) {
                return React.createElement(TodoItem, { key: todoItem.id,
                    id: todoItem.id,
                    text: todoItem.text,
                    completed: todoItem.completed,
                    onUpdateTodoText: props.onUpdateTodoText,
                    onUpdateTodoComplete: props.onUpdateTodoComplete,
                    onDestroyTodo: props.onDestroyTodo
                });
            })
        )
    );
};
'use strict';

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
            'editing': false,
            'editText': props.text
        };
        _this._editNode = null;
        return _this;
    }

    _createClass(TodoItem, [{
        key: 'buildClassNames',
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
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'li',
                { className: this.buildClassNames() },
                React.createElement(
                    'div',
                    { className: 'view' },
                    React.createElement('input', { className: 'toggle', type: 'checkbox',
                        checked: this.props.completed ? "checked" : null,
                        onChange: this.handleCheckbox.bind(this) }),
                    React.createElement(
                        'label',
                        { onDoubleClick: this.handleEdit.bind(this) },
                        this.props.text
                    ),
                    React.createElement('button', { className: 'destroy', onClick: this.handleDestroy.bind(this) })
                ),
                React.createElement('input', { className: 'edit',
                    value: this.state.editText,
                    ref: function ref(c) {
                        return _this2._editNode = c;
                    },
                    onChange: this.handleChange.bind(this),
                    onKeyDown: this.handleKeyDown.bind(this),
                    onBlur: this.handleSubmit.bind(this)
                })
            );
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (!prevState.editing && this.state.editing) {
                this._editNode.focus();
                this._editNode.setSelectionRange(node.value.length, node.value.length);
            }
        }
    }, {
        key: 'handleCheckbox',
        value: function handleCheckbox(value) {
            this.props.onUpdateTodoComplete(this.props.id, !this.props.completed);
        }
    }, {
        key: 'handleEdit',
        value: function handleEdit() {
            this.setState({ editing: true });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            if (this.state.editing) {
                this.setState({ editText: event.target.value });
            }
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(event) {
            if (event.which === Constants.ESCAPE_KEY) {
                this.setState({ editText: this.props.text });
                this.setState({ editing: false });
            } else if (event.which === Constants.ENTER_KEY) {
                this.handleSubmit(event);
            }
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            var val = this.state.editText.trim();
            if (val) {
                this.setState({ editText: val });
                this.props.onUpdateTodoText(this.props.id, val);
            } else {
                this.props.onDestroyTodo(this.props.id);
            }
            this.setState({ editing: false });
        }
    }, {
        key: 'handleDestroy',
        value: function handleDestroy() {
            this.props.onDestroyTodo(this.props.id);
        }
    }]);

    return TodoItem;
})(React.Component);

TodoItem.defaultProps = {
    completed: false,
    text: null,
    id: null,
    onUpdateTodoText: null,
    onUpdateTodoComplete: null,
    onDestroyTodo: null
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utilities = function Utilities() {
    _classCallCheck(this, Utilities);
};

Utilities.ajax = function (params) {
    var method = params.method;
    var endpoint = params.endpoint;
    var data = params.data;
    var beforeSend = params.beforeSend;
    var success = params.success;
    var error = params.error;

    var request = new XMLHttpRequest();
    request.open(method, endpoint, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            if (success != null) {
                success(request.responseText);
            }
        } else {
            // We reached our target server, but it returned an error
            if (error != null) {
                error();
            }
        }
    };

    request.onerror = function () {
        if (error != null) {
            error();
        }
    };

    if (beforeSend != null) {
        beforeSend(request);
    }
    request.send(data);
};