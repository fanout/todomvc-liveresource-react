export function syncItems(data) {
    // TODO: Examine efficiency and correctness of this algorithm

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

export function createTodo(text) {
    // This is a "tentative one" to display
    // until we get official update notice
    return {
        id: createGuid(),
        text: text,
        completed: false,
        pendingSync: true
    };
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function createGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

