const initialValue = {
};

export default function options(state = initialValue, action) {
    switch (action.type) {
        case "SET_OPTIONS": {
            const { options } = action;
            return Object.assign({}, state, options);
        }
    }
    return state;
}

export function getOptions(state) {
    return state;
}
