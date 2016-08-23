const initialValue = {
    todoItems: [],
    loadingItemsMessage: null
};

export default function todo(state = initialValue, action) {
    switch (action.type) {
        case "SET_TODO_ITEMS": {
            const { todoItems } = action;
            return Object.assign({}, state, { todoItems });
        }
        case "SET_LOADING_ITEMS_MESSAGE": {
            const { loadingItemsMessage } = action;
            return Object.assign({}, state, { loadingItemsMessage });
        }
    }
    return state;
}

export function getTodoItems(state) {
    return state.todoItems;
}

export function getLoadingItemsMessage(state) {
    return state.loadingItemsMessage;
}
