import types from '../actions/types';

const initialState = {
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_DETAIL:
            return {
                ...state,
                data: action.payload.resourceDetails
            };
        default:
            return state;
    }
}