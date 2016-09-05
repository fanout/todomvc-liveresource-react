const initialValue = {
    todoItems: {},
    loadingItemsMessage: null
};

export default function todo(state = initialValue, action) {
    switch (action.type) {
        case "SET_TODO_ITEMS": {
            const { listId, todoItems } = action;
            const newTodoItems = Object.assign({}, todoItems, { [listId]: todoItems });
            return Object.assign({}, state, { todoItems: newTodoItems });
        }
        case "SET_LOADING_ITEMS_MESSAGE": {
            const { loadingItemsMessage } = action;
            return Object.assign({}, state, { loadingItemsMessage });
        }
    }
    return state;
}

const emptyArray = [];
export function getTodoItems(state, listId) {
    const todoItems = state.todoItems[listId];
    return todoItems != null ? todoItems : emptyArray;
}

export function getLoadingItemsMessage(state) {
    return state.loadingItemsMessage;
}
