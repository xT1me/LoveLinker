import { SET_IS_ADMIN, SET_USER } from "./actionTypes";

const defaultState = {
    user: null,
    isAuthenticated: false,
    userId: null,
    isAdmin: null
};

export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload, isAuthenticated: !!action.payload };
        case SET_IS_ADMIN:
            return { ...state, isAdmin: action.payload };
        default:
            return state;
    }
};
