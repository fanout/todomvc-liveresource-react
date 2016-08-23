import { combineReducers } from "redux";

import options from "./options";
import todo from "./todo";

export default combineReducers({
    options,
    todo
});

export function getOptionsState(state) {
    return state.options;
}

export function getTodoState(state) {
    return state.todo;
}
