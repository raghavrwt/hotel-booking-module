import types from '../actions/types';
import {
    getParent,
    getVerticalObj
} from '../common/menuFunctions';

const initialState = {
    data: [],
    selectedVertical: null,
    selectedMenu: null,
    dialog: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_MENU:
            return {
                ...state,
                data: action.payload.data,
                selectedMenu: action.payload.selectedMenu || null,
                selectedVertical: action.payload.selectedVertical
            };
        case types.SET_MENU:
            return {
                ...state,
                selectedMenu: action.payload.selectedMenu,
                selectedVertical: action.payload.selectedVertical,
                loading: false
            };
        case types.DELETE_RESOURCE: {
            const newState = { ...state };
            const verticalObj = getVerticalObj(newState.data, newState.selectedVertical);
            const selectedMenu = newState.selectedMenu;
            const {
                parent,
                index
            } = getParent(verticalObj, selectedMenu.id);
            const resourceId = action.payload.resourceId;

            parent[index] = {
                ...selectedMenu,
                data: selectedMenu.data.filter(resource => resource.resourceId !== resourceId)
            };

            newState.selectedMenu = parent[index];

            return newState;
        }
        case types.SHOW_HIDE_REDIRECTION_DIALOG:
            return {
                ...state,
                dialog: action.payload
            }

        case types.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state;
    }
}