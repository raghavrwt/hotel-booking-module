import types from './types';
import axios from 'axios';
import { format, addDays, parse, compareAsc } from 'date-fns';
import {
    serverDateTimeFormat,
    serverDateFormat,
    getDateList,
    getSlotsList
} from '../common/dateFunctions';

const getSlotsWithBlockStatus = ({ date, slotTime, blockedDates }) => {
    const dateStr = format(date, serverDateFormat);

    const selectedDateObj = blockedDates.find(item => item.date === dateStr);

    if (!selectedDateObj) {
        return [];
    }

    const {
        blockedTime: blockedRanges,
        startTime,
        endTime
    } = selectedDateObj;

    const slots = getSlotsList({
        start: startTime,
        end: endTime,
        interval: slotTime,
        date
    });

    return slots.map(slot => {
        let blocked = false;
        const blockedLen = blockedRanges.length;

        for (let i = 0; i < blockedLen; i++) {
            const {
                startTime,
                endTime
            } = blockedRanges[i];
            const startObj = parse(`${dateStr}T${startTime}`, serverDateTimeFormat, new Date());
            const endObj = parse(`${dateStr}T${endTime}`, serverDateTimeFormat, new Date());

            if (compareAsc(slot, startObj) >= 0 && compareAsc(slot, endObj) <= 0) {
                blocked = true;
                break;
            }
        }

        return {
            date: slot,
            blocked
        };
    });
}

export const setSlotData = ({ startDateObj, interval, setDateList = true, cb }) => {
    return async (dispatch, getStore) => {
        const {
            booking: {
                query,
                resourceId,
                settingsData: {
                    settings
                }
            },
            slots: {
                dates: initialList
            }
        } = getStore();
        const totalDays = settings['Allow Booking Upto'];
        const locationId = query['Location'].paramId;
        let endDateObj;

        if (!startDateObj) {
            startDateObj = addDays(new Date(), Number(settings['Allow Booking Before']));
        }
        if (!interval) {
            interval = Math.min(Number(totalDays), 7);
        }

        endDateObj = addDays(startDateObj, interval - 1);

        const {
            status,
            data
        } = await axios.post('/omni_bookings/customer/getResourceTimings.ns', {
            startDate: format(startDateObj, serverDateFormat),
            endDate: format(endDateObj, serverDateFormat),
            locationId,
            resourceId
        });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        const dateList = setDateList ? getDateList({
            days: totalDays,
            start: startDateObj
        }) : initialList;
        const slots = getSlotsWithBlockStatus({
            slotTime: data.slotTime,
            date: startDateObj,
            blockedDates: data.blockedDates
        });

        dispatch({
            type: types.SET_SLOTS_DATA,
            payload: {
                dates: dateList,
                slots,
                selectedDate: startDateObj,
                blockedDates: data.blockedDates,
                slotTime: data.slotTime
            }
        });

        cb && cb();
    }
}

export const setSlotDate = (date) => {
    return (dispatch, getStore) => {
        const {
            booking: {
                settingsData: {
                    settings
                }
            },
            slots: {
                blockedDates,
                slotTime
            }
        } = getStore();

        const slots = getSlotsWithBlockStatus({
            slotTime,
            date,
            blockedDates
        });

        dispatch({
            type: types.SET_SLOT_DATE,
            payload: {
                selectedDate: date,
                slots
            }
        });

    };
}