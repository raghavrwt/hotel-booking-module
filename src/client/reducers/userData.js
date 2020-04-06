import types from '../actions/types';

const initialState = {
    supId: null,
    verticalId: 1
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_USER_DATA:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}