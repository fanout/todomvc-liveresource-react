export function syncItems(data) {
    // TODO: ?

    const mappedIds = [];
    const mappedItems = {};
    data.forEach(item => {
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

    const todoItems = [];
    mappedIds.forEach(id => {
        if (id in mappedItems) {
            todoItems.push(mappedItems[id]);
        }
    });

    return todoItems;
}

let nextId = 0;
export function createTodo(text) {
    // This is a "tentative one" to display
    // until we get official update notice
    nextId = nextId - 1;
    return {
        id: nextId,
        text: text,
        completed: false,
        pendingSync: true
    };
}
