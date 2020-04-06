import types from '../actions/types';

const initialState = {
    data: {},
    view: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.INITIALIZE_MENU:
            return {
                ...state,
                ...action.payload.pageData
            }
        case types.SET_MENU: {
            return {
                ...action.payload.pageData
            };
        };
        case types.SET_PAGE_DATA: {
            return {
                ...action.payload
            };
        }
        case types.CALENDAR_DATA:
            console.log(action.payload);
            {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        ...action.payload
                    }
                };
            }

        case types.LOCATION_DATA:

            {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        ...action.payload
                    }
                }
            }

        case types.RATE_LOCATION_DATA:

            {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        ...action.payload
                    }
                }
            }

        case types.RATE_CALENDAR_DATA:
            {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        ...action.payload
                    }
                }
            }

        case types.BOOKING_DATA:
            {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        ...action.payload
                    }
                }
            }
        default:
            return state;
    }
}