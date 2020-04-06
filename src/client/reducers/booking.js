import types from '../actions/types';

const initialState = {
    resourceId: null,
    searchForm: [],
    query: {},
    price: 0,
    addons: [],
    resourceAvailable: true,
    showBooking: false,
    selectedResource: {},
    settingsData: {},
    dependants: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_LISTING: {
            return {
                ...state,
                searchForm: action.payload.searchForm,
                query: action.payload.query,
                dependants: action.payload.dependants,
                settingsData: {
                    ...action.payload.settingsData,
                    settings: {
                        ...action.payload.settingsData.settings,
                        'Allow Booking Before': 1,
                        'Allow Booking Upto': 16
                    }
                }
            };
        }
        case types.INITIALIZE_DETAIL: {
            return {
                ...state,
                searchForm: action.payload.searchForm,
                query: action.payload.query,
                price: action.payload.price,
                addons: action.payload.addons || [],
                resourceId: action.payload.resourceDetails.id,
                dependants: action.payload.dependants,
                dependantIndexes: action.payload.dependantIndexes,
                settingsData: {
                    ...action.payload.settingsData,
                    settings: {
                        ...action.payload.settingsData.settings,
                        'Allow Booking Before': 1,
                        'Allow Booking Upto': 16
                    }
                }
            };
        }
        case types.SET_RESOURCE_LIST:
            return {
                ...state,
                query: action.payload.query,
                dependants: action.payload.dependants
            }
        case types.UPDATE_BOOKING_INFO:
            return {
                ...state,
                ...action.payload
            }
        case types.SHOW_BOOKING_MODAL: {
            const resource = action.payload.selectedResource;

            let newState;

            if (resource) {
                newState = {
                    ...state,
                    selectedResource: { ...resource },
                    showBooking: true,
                    addons: resource.addons || [],
                    price: resource.price,
                    resourceId: action.payload.resourceId,
                    dependantIndexes: resource.dependantIndexes
                }
            } else {
                newState = {
                    ...state,
                    showBooking: true,
                }
            }

            return newState;
        }
        case types.HIDE_BOOKING_MODAL:
            return {
                ...state,
                showBooking: false
            }
        case types.UPDATE_AVAILABILITY_AND_PRICE:
            return {
                ...state,
                price: action.payload.price,
                resourceAvailable: action.payload.resourceAvailable
            }
        default:
            return state;
    }
}