import types from '../actions/types';

const initialState = {
    resourceList: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_LISTING:
            return {
                ...state,
                resourceList: action.payload.resourceList
            };
        case types.SET_RESOURCE_LIST:
            return {
                ...state,
                resourceList: action.payload.resourceList
            }
        default:
            return state;
    }
}