import types from '../actions/types';

const initialState = {
    selectedDate: null,
    dates: [],
    slots: [],
    blockedDates: [],
    slotTime: 1
};

export default function(state=initialState, action) {
    switch(action.type) {
        case types.SET_SLOTS_DATA:
            return {
                ...state,
                dates: action.payload.dates,
                slots: action.payload.slots,
                selectedDate: action.payload.selectedDate,
                slotTime: action.payload.slotTime,
                blockedDates: action.payload.blockedDates
            };
        case types.SET_SLOT_DATE:
            return {
                ...state,
                selectedDate: action.payload.selectedDate,
                slots: action.payload.slots
            };
        default:
            return state;
    }
}