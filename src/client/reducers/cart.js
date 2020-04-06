import types from '../actions/types';

const initialState = {
    items: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_CART_DATA:
            return {
                ...state,
                items: action.payload.items
            }
        case types.ADD_TO_CART:
            return {
                ...state,
                items: state.items.concat(action.payload.items)
            };
        case types.DELETE_FROM_CART: {
            const newItems = [...state.items];
            newItems.splice(action.payload, 1);

            return {
                ...state,
                items: newItems
            }
        }
        default:
            return state;
    }
}