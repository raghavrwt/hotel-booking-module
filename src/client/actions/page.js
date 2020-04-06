import types from './types';
import {
    fetchPageData,
    saveResourceData,
    saveBlockData,
    saveRateData,
    fetchLocationData, deleteBlockData,
    resetCustomRates,
    saveBookingData,
    fetchBookingData,
    addBookingEvent,
    resetBookingDates,
    fetchRateCalendarLocationData,
    saveRateCalendarData,
    resetRateCalendarCustomRates
} from '../common/requests';
import { compareAsc } from 'date-fns';
//import { addDays } from 'date-fns/addDays';

export const setResourceData = (menuId, resourceId) => {
    return async dispatch => {
        const { isSuccess, ...pageResponse } = await fetchPageData({
            menuId,
            resourceId
        });

        if (!isSuccess) {
            return;
        }

        dispatch({
            type: types.SET_PAGE_DATA,
            payload: {
                data: {
                    ...pageResponse,
                    resourceId
                },
                view: 'FORM'
            }
        });
    };
}

export const setResourceList = () => {
    return (dispatch, getStore) => {
        const { selectedMenu } = getStore().menu;
        dispatch({
            type: types.SET_PAGE_DATA,
            payload: {
                data: { ...selectedMenu },
                view: 'RESOURCELIST'
            }
        });
    };
}

export const saveFormData = (data, addOnData, cb) => {
    return async (dispatch, getStore) => {
        const {
            menu: {
                selectedMenu,
                selectedVertical
            },
            page: {
                data: {
                    resourceId
                }
            }
        } = getStore();


        let arr = [];
        let partOf = [];
        let dependantOn = [];
        let resourceName = '';
        let groupId = null;

        //form data formatting
        Object.keys(data).forEach(attrId => {
            const obj = data[attrId];

            switch (attrId) {
                case 'p':
                    return partOf = obj.value;
                case 'd':
                    return dependantOn = obj.value;
                case 'g':
                    return groupId = obj.value[0];
            }

            if (obj.resourceType == 'NAME') {
                resourceName = obj.value[0];
            }

            arr.push({
                attributeId: obj.attributeId,
                attributeName: obj.name,
                values: obj.value,
                resourceType: obj.resourceType
            });
        });

        //addon formatting
        const addonsData = addOnData.map(addOn => {
            return {
                addonId: addOn.addonId,
                name: addOn.name.value[0],
                maxQty: addOn.maxQty.value[0],
                pricePerQty: addOn.pricePerQty.value[0],
                priceType: addOn.priceType.value[0]
            }
        });

        const saveData = {
            menuId: selectedMenu.id,
            partOf,
            dependantOn,
            attributeData: arr,
            addonsData,
            resourceId,
            partOfGroup: groupId
        }

        console.log(saveData);
        console.log(addOnData);

        const response = await saveResourceData(saveData);

        if (!response.isSuccess || !selectedMenu.allowMultiple) {
            return cb && cb(false);
        }

        //modifying menu data
        const list = selectedMenu.data || [];

        if (resourceId == null) {
            list.push({
                resourceId: response.resourceId,
                resourceName
            });
        } else {
            const len = list.length;
            for (let i = 0; i < len; i++) {
                if (list[i].resourceId == resourceId) {
                    list[i] = {
                        ...list[i],
                        resourceName
                    }
                    break;
                }
            }
        }
        selectedMenu.data = list;

        dispatch({
            type: types.SET_MENU,
            payload: {
                selectedMenu: { ...selectedMenu },
                selectedVertical,
                pageData: {
                    data: {},
                    view: 'RESOURCELIST'
                }
            }
        });

        cb && cb(true);
    }
}

export const blockDay = (dataSource, handleData, showResources, selected, timeSlotUnit, form) => {
    return async (dispatch, getStore) => {

        console.log(handleData);
        console.log(selected);
        console.log(dataSource);
        var resourceId = [];
        dataSource.location.map(loc => {
            if (loc.id === selected) {
                resourceId.push(loc.id);
                showResources.map(res => {
                    if (parseInt(handleData.resource.id) === parseInt(res.id)) {
                        resourceId.push(Number(res.id));
                    }
                })
            }
        })

        let startTime = form.type[0].value.substring(0, 19).replace('T', ' ')
        let endTime = form.type[1].value.substring(0, 19).replace('T', ' ')

        console.log(resourceId);
        var serverObj = {
            "startDateTime": timeSlotUnit === "DAY" ? form.type[0].value + " 00:00:00" : startTime,
            "endDateTime": timeSlotUnit === "DAY" ? form.type[1].value + " 00:00:00" : endTime,
            "resourceId": resourceId
        }

        console.log(serverObj);
        //const response = { isSuccess: true };//await saveBlockData(serverObj);
        const response = await saveBlockData(serverObj);
        if (!response.isSuccess) {
            return;
        }
        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();
        console.log(getStore());
        console.log(data);
        const list = data.blockedDates || []
        console.log(data.blockedDates)
        //console.log(list);
        // data = {
        //     eventsBlocked,
        //     rates,

        // }

        console.log(form.type);

        var displayObj = {
            "id": response.id,
            "resourceIds": resourceId,
            "start": form.type[0].value,
            "end": form.type[1].value,
            "rendering": "background",
            "color": "#333333"
        }

        dispatch({
            type: types.CALENDAR_DATA,
            payload: { blockedDates: list.concat(displayObj) }
        });
    }
}

export const deleteBlockDay = (events, eventsBlocked, selected, timeSlotUnit) => {
    return async (dispatch, getStore) => {
        console.log(events);
        console.log(eventsBlocked);
        console.log(selected);
        var filterArr = [];
        console.log(events._def.resourceIds[1]);


        filterArr = eventsBlocked.filter(e => {
            return e.id !== parseInt(events.id);
        })

        var serverObj = {
            "id": parseInt(events.id),
            "type": "blocked dates"
        }

        const response = await deleteBlockData(serverObj);

        if (!response.isSuccess) {
            return;
        }
        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();
        console.log(getStore());
        dispatch({
            type: types.CALENDAR_DATA,
            payload: { blockedDates: filterArr }
        });
    }
}

export const resetBooking = (events, eventBookings, selected, startDateTime, endDateTime) => {
    return async (dispatch, getStore) => {
        var filterArr = [];
        filterArr = eventBookings.filter(e => {
            return e.id !== parseInt(events.id);
        })

        console.log(filterArr);
        var serverObj = {
            "id": parseInt(events.id),
            "type": "booking"
        }
        console.log(serverObj);
        const response = await resetBookingDates(serverObj);
        if (!response.isSuccess) {
            return;
        }
        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();
        console.log(getStore());
        dispatch({
            type: types.CALENDAR_DATA,
            payload: { bookings: filterArr }
        });
    }
}

export const resetRateCalendarRate = (events, eventRates, selected, startDateTime, endDateTime, globalRates) => {

    return async (dispatch, getStore) => {
        // var filterArr = [];
        // filterArr = eventRates.filter(e => {
        //     return e.id !== parseInt(events.id);
        // })
        console.log(events.id);
        console.log(globalRates);

        const globalRatesId = globalRates.map(rateId => {
            return rateId.id;
        })

        console.log(globalRatesId);

        let filterArr = [];
        let newFilterArr = [];
        filterArr = eventRates.map(rateOne => {
            if (globalRatesId.indexOf(rateOne.id) > -1 || rateOne.id !== parseInt(events.id)) {
                filterArr.push(rateOne);
            }
            if (rateOne.id === parseInt(events.id)) {
                globalRates.map(global => {
                    if (rateOne.resourceId === parseInt(global.resourceId)) {
                        filterArr.push({
                            id: global.id,
                            title: global.rate,
                            "rendering": "background",
                            "color": "#b3e6ff",
                            resourceId: global.resourceId,
                            startTime: rateOne.startTime,
                            endTime: rateOne.endTime,
                            daysOfWeek: rateOne.daysOfWeek
                        })
                    }
                })
            }
            newFilterArr = filterArr;
        })

        console.log(newFilterArr);
        var serverObj = {
            "id": parseInt(events.id),
            "type": "weekly rates"
        }

        const response = await resetRateCalendarCustomRates(serverObj);

        if (!response.isSuccess) {
            return;
        }

        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();
        console.log(getStore());

        dispatch({
            type: types.RATE_CALENDAR_DATA,
            payload: { rates: newFilterArr }
        });
    }
}

export const resetRate = (events, eventRates, selected, startDateTime, endDateTime, globalRates) => {
    return async (dispatch, getStore) => {
        // var filterArr = [];
        // filterArr = eventRates.filter(e => {
        //     return e.id !== parseInt(events.id);
        // })
        console.log(events.id);
        console.log(globalRates);
        let filterArr = [];
        let newFilterArr = [];
        filterArr = eventRates.map(rateOne => {
            if (!rateOne.id || rateOne.id !== parseInt(events.id)) {
                filterArr.push(rateOne);
            }
            if (rateOne.id === parseInt(events.id)) {
                globalRates.map(global => {
                    if (rateOne.resourceIds[1] === parseInt(global.resourceId[1])) {
                        filterArr.push({
                            title: global.rate,
                            "rendering": "background",
                            "color": "#b3e6ff",
                            resourceIds: rateOne.resourceIds,
                            start: rateOne.start,
                            end: rateOne.end
                        })
                    }
                })
            }
            newFilterArr = filterArr;
        })

        console.log(newFilterArr);
        var serverObj = {
            "id": parseInt(events.id),
            "type": "custom rates"
        }

        const response = await resetCustomRates(serverObj);

        if (!response.isSuccess) {
            return;
        }

        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();
        console.log(getStore());

        dispatch({
            type: types.CALENDAR_DATA,
            payload: { rates: newFilterArr }
        });
    }
}

export const addBooking = (dataSource, formData, resources, selectedLoc, form, allowToDate, timeSlotUnit, person, service) => {
    return async (dispatch, getStore) => {

        console.log(selectedLoc);
        console.log(resources);
        console.log(formData);
        console.log(form);
        let resourceId = [];
        let newResourceId = [];
        //let minuteResourceId = [];
        resourceId = resources.map(res => {
            if (parseInt(formData.resource.id) === parseInt(res.id)) {
                resourceId.push(res.id);
            }
            newResourceId = resourceId;
        })
        let minuteResourceId = [];
        minuteResourceId.push(service, person);
        console.log(minuteResourceId);
        console.log(formData);
        let customNewResourceId = [];
        customNewResourceId = timeSlotUnit === "DAY" ? newResourceId : minuteResourceId;
        var s = new Date(form.type[0].value);
        var startTime = (new Date(s - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19);

        var fromDate = new Date(form.type[0].value);
        var toDate = fromDate.setMinutes(fromDate.getMinutes() + 30);
        var endToDate = (new Date(toDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19);
        console.log(endToDate);
        var e = allowToDate == 1 ? new Date(form.type[1].value) : "";
        var endTime = allowToDate == 1 ? (new Date(e - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19) : "";
        console.log(startTime);
        //console.log(formData);
        //console.log(startTime);
        console.log(endTime);
        //timeSlotUnit === "DAY" ? formData.startStr + " 00:00:00" : startsTime
        let addOn = [];
        let newAddOn = [];
        let newForm = [];
        newForm = form;
        console.log(newForm.type);
        addOn = newForm.type.map(addon => {
            if (addon && addon.id) {
                addOn.push({
                    "addonId": addon.id,
                    "qty": parseInt(addon.value)
                })
            }
            console.log(addOn);
            newAddOn = addOn;
        })
        var serverObj = {
            "verticalId": 1,
            "locationId": selectedLoc,
            "resourceId": customNewResourceId,
            "startDateTime": startTime,
            "endDateTime": allowToDate == 1 ? endTime : endToDate,
            "query": {
                "Max Guests": form.type[4].value,
                "Max Kids": form.type[5].value
            },
            "addons": newAddOn
        }

        console.log(serverObj);

        const response = await addBookingEvent(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);

        const {
            page: {
                data
            }
        } = getStore();

        console.log(getStore());
        console.log(data);

        const list = data.bookings || []
        console.log(data.bookings)
        //console.log(handleData);
        var displayObj = {
            "id": response.id,
            "resourceIds": customNewResourceId,
            "color": "#009900",
            "start": timeSlotUnit === "DAY" ? startTime.substring(0, 10) : startTime,
            "end": timeSlotUnit === "DAY" ? endTime.substring(0, 10) : endToDate,
            "title": response.customerName
        }
        dispatch({
            type: types.CALENDAR_DATA,
            payload: { bookings: list.concat(displayObj) }
        });
    }
}


export const addBookingData = (dataSource, handleData, showResources, selected, allowToDate) => {
    return async (dispatch, getStore) => {

        //console.log(handleData);
        var resourceId = 0;
        var locationId = 0;
        dataSource.location.map(loc => {
            if (loc.id === selected) {
                locationId = loc.id;

            }
        })
        showResources.map(res => {
            if (parseInt(handleData.resource.id) === parseInt(res.id)) {
                resourceId = res.id;
            }
        })

        var serverObj = {
            "verticalId": 1,
            "locationId": locationId,
            "resourceId": resourceId,
            "startDateTime": null,
            "endDateTime": null
        }
        const response = await saveBookingData(serverObj);

        if (!response.isSuccess) {
            return;
        }
        const {
            page: {
                data
            }
        } = getStore();

        const {
            searchForm = [],
            resourceList = []
        } = response;

        var customArr = [];
        resourceList.map(resource => {
            if (resource.addons) {
                resource.addons.map(addon => {
                    const objectOne = [{
                        title: "Add On Name",
                        value: addon.name,
                        name: addon.name,
                        type: "text"
                    },
                    {
                        id: addon.id,
                        title: "Max Qty",
                        value: addon.maxQty,
                        name: "Max Qty",
                        type: "number"
                    }
                    ]
                    customArr.push(...objectOne);
                    console.log(customArr);

                })
            }

        })

        const newSearchForm = searchForm.map((element) => ({
            ...element,
            title: element.name,
            type: element.type === "INT" ? "number" : element.type,
            value: element.data.value
        }))


        var filterArr = []
        filterArr = newSearchForm.filter((element) => {
            return element.name !== "Location" && element.type !== "DATE";
        })

        dispatch({
            type: types.CALENDAR_DATA,
            payload: { searchForm: filterArr, resourceList: customArr }
        });
    }
}

export const addRateCalendarRate = (dataSource, handleData, showResources, selected, form, allowToDate, timeSlotUnit, startDateTime, endDateTime) => {
    return async (dispatch, getStore) => {
        console.log("In add Calendar rate");
        //var resourceId = [];
        console.log(handleData);

        const beginDate = new Date(startDateTime);
        const lastDate = new Date(endDateTime);

        console.log(beginDate);
        console.log(lastDate);

        let dayDateArray = [];
        while (beginDate < lastDate) {
            var begin = (new Date(beginDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19);
            dayDateArray.push(begin);
            //newMinuteDateArray.push(begin.substring(11, 19))
            beginDate.setDate(beginDate.getDate() + 1);
        }

        const bDate = new Date(startDateTime);
        const lDate = new Date(endDateTime);
        let minuteDateArray = [];
        let newMinuteDateArray = [];
        while (bDate < lDate) {
            console.log("In while");
            var begin = (new Date(bDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19);
            console.log(begin);
            minuteDateArray.push(begin);
            console.log(minuteDateArray);
            newMinuteDateArray.push(begin.substring(11, 19))
            bDate.setMinutes(bDate.getMinutes() + 30);
        }

        console.log(minuteDateArray);

        const firstDateArray = timeSlotUnit === "DAY" ? dayDateArray : minuteDateArray;

        console.log(firstDateArray);

        const dayArray = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        var startDate = new Date(handleData.start);
        //console.log(startDay);
        var endDate = new Date(handleData.end);
        //console.log(endDay);

        let weekDayNumber = [];
        //      let firstDateArray = [];
        while (startDate < endDate) {
            const startDay = new Date(startDate).getDay();
            console.log(startDay);
            weekDayNumber.push(dayArray[startDay]);
            startDate.setDate(startDate.getDate() + 1);
        }

        console.log(weekDayNumber);
        //console.log(firstDateArray);

        let startsTime = new Date(handleData.start);
        let startHours = startsTime.getHours();
        let startMinutes = startsTime.getMinutes();
        let endeTime = new Date(handleData.end);
        let endHours = endeTime.getHours();
        let endMinutes = endeTime.getMinutes();

        var serverObj = timeSlotUnit === "DAY" ? {
            "locationId": parseInt(selected),
            "resourceId": parseInt(handleData.resource.id),
            "day": weekDayNumber,
            "startTime": null,
            "endTime": null,
            "rate": Number(form)
        } : {
                "locationId": parseInt(selected),
                "resourceId": parseInt(handleData.resource.id),
                "day": weekDayNumber,
                "startTime": startHours + ":" + startMinutes + ":00",
                "endTime": endHours + ":" + endMinutes + ":00",
                "rate": Number(form)
            }

        console.log(serverObj);
        const response = await saveRateCalendarData(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);

        const {
            page: {
                data
            }
        } = getStore();

        console.log(getStore());
        console.log(data);

        let dateToDay = []
        firstDateArray.map(date => {
            let day = new Date(date).getDay();
            //console.log(dayObj);
            dateToDay.push(dayArray[day]);
        })

        console.log(dateToDay);

        const updateRate = data.rates.map(rate => {
            let daysofweek = [];
            var day = dayArray.indexOf(rate.day);
            daysofweek.push(day);
            const responseId = response.ids[weekDayNumber.indexOf(rate.day)]
            if (parseInt(rate.resourceId) == parseInt(handleData.resource.id)) {
                var startTime = new Date(handleData.start);
                var endTime = new Date(handleData.end);
                var date = timeSlotUnit === "DAY" ? new Date(firstDateArray[dateToDay.indexOf(rate.day)]) :
                    new Date(firstDateArray[newMinuteDateArray.indexOf(rate.startTime)]);

                if (date >= startTime && date < endTime) {
                    //console.log("adsdsa")
                    return ({
                        ...rate,
                        id: responseId,
                        "rendering": "background",
                        "color": "#3399ff",
                        title: Number(form),
                        daysOfWeek: daysofweek
                    })
                }
                else {
                    return rate;
                }
            }
            else {
                return rate;
            }
        })
        console.log(updateRate);
        dispatch({
            type: types.RATE_CALENDAR_DATA,
            payload: { rates: updateRate }
        });
    }
}

export const addRate = (dataSource, handleData, showResources, selected, form, allowToDate, timeSlotUnit) => {
    return async (dispatch, getStore) => {
        console.log("In add rate");
        var resourceId = [];
        dataSource.location.map(loc => {
            if (loc.id === selected) {
                resourceId.push(loc.id);
                showResources.map(res => {
                    if (parseInt(handleData.resource.id) === parseInt(res.id)) {
                        resourceId.push(Number(res.id));
                    }
                })
            }
        })

        let startsTime = form.type[0].value.substring(0, 19).replace('T', ' ')
        let endeTime = form.type[1].value.substring(0, 19).replace('T', ' ')

        var serverObj = {
            "startDateTime": timeSlotUnit === "DAY" ? form.type[0].value + " 00:00:00" : startsTime,
            "endDateTime": timeSlotUnit === "DAY" ? form.type[1].value + " 00:00:00" : endeTime,
            "resourceId": resourceId,
            "rate": form.type[4].value ? Number(form.type[4].value) : ''
        }

        console.log(serverObj);
        const response = await saveRateData(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();

        console.log(getStore());
        console.log(data);

        const list = data.rates || []
        console.log(data.rates)
        console.log(handleData);
        let updateRate = [];
        updateRate = data.rates.map(rate => {
            if (rate.resourceIds[1] == parseInt(handleData.resource.id)) {
                var startTime = new Date(form.type[0].value);
                var date = new Date(rate.start);
                var endTime = new Date(form.type[1].value);
                if (date >= startTime && date < endTime) {
                    //console.log("adsdsa")
                    return ({
                        ...rate,
                        id: response.id,
                        "rendering": "background",
                        "color": "#3399ff",
                        title: form.type[4].value ? Number(form.type[4].value) : ''
                    })
                }
                else {
                    return rate;
                }
            }

            else {
                return rate;
            }
            console.log(updateRate);
        })
        dispatch({
            type: types.CALENDAR_DATA,
            payload: { rates: updateRate }
        });

    }
}

export const locationChange = (dataSource, showResources, selected, selectedRes, startDateTime, endDateTime, timeSlotUnit, globalRates) => {

    return async (dispatch, getStore) => {
        var serverObj = {
            "locationId": parseInt(selected),
            "resourceId": parseInt(selectedRes),
            "startDateTime": startDateTime,
            "endDateTime": endDateTime
        }
        console.log(serverObj);
        const response = await fetchLocationData(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);
        const {
            page: {
                data
            }
        } = getStore();

        console.log(response.data);
        const {
            blockedDates = [],
            rates = [],
            bookings = []
        } = response.data;

        const newBlockedDates = blockedDates.map(date => ({
            ...date,
            start: date.startDateTime,
            end: date.endDateTime,
            rendering: "background",
            color: "#333333",
            resourceIds: date.resourceId
        }))


        const globalFilterRates = rates.filter(rate => {
            return rate.id == undefined;
        })

        console.log(globalFilterRates);

        // var fromDate = new Date(formData.start);
        // var toDate = new Date(formData.start).setMinutes(new Date(formData.start).getMinutes() + 30);
        // var endToDate = (new Date(new Date(booking.startDateTime).setMinutes(new Date(booking.startDateTime).getMinutes() + 30) - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19);

        const newBookings = bookings.map(booking => ({
            ...booking,
            title: booking.customerName,
            "color": "#009900",
            start: timeSlotUnit === "DAY" ? booking.startDateTime.substring(0, 10) : booking.startDateTime,
            end: timeSlotUnit === "DAY" ? booking.endDateTime.substring(0, 10) : (new Date(new Date(booking.startDateTime).setMinutes(new Date(booking.startDateTime).getMinutes() + 30) - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19),
            resourceIds: booking.resourceId
        }))

        console.log(rates);
        var start = new Date(startDateTime);
        var end = new Date(endDateTime)
        let dateArray = [];
        while (start <= end) {
            //console.log(start);
            var startDate = (new Date(start - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
            startDate = startDate.replace('T', ' ');
            startDate = startDate.substring(0, 19);
            dateArray.push(startDate);
            start.setDate(start.getDate() + 1);
        }

        //console.log(dateArray);

        var startTime = new Date(startDateTime);
        var endTime = new Date(endDateTime)

        let dateRateArray = [];
        while (startTime <= endTime) {
            //console.log(start);
            var startDate = (new Date(startTime - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
            startDate = startDate.replace('T', ' ');
            startDate = startDate.substring(0, 19);
            //console.log(startDate);
            dateRateArray.push(startDate);
            startTime.setMinutes(startTime.getMinutes() + 30);
        }


        let newDateArray = [];
        newDateArray = timeSlotUnit === "DAY" ? dateArray : dateRateArray
        console.log(newDateArray);
        let finalArr = [];
        finalArr = ratesDefault(rates, newDateArray, timeSlotUnit);

        dispatch({
            type: types.LOCATION_DATA,
            payload: {
                ...response.data,
                rates: finalArr,
                blockedDates: newBlockedDates,
                bookings: newBookings,
                globalRates: globalFilterRates
            }
        });
    }
}

export const rateCalendarLocationChange = (dataSource, showResources, selected, selectedRes, startDateTime, endDateTime, timeSlotUnit, globalRates, startDay) => {
    return async (dispatch, getStore) => {

        const weekArray = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        console.log(weekArray[startDay]);

        var serverObj = timeSlotUnit === "DAY" ? parseInt(selectedRes) === -1 ? {
            "locationId": parseInt(selected)
        } : {
                "locationId": parseInt(selected),
                "resourceId": parseInt(selectedRes)
            } : {
                "locationId": parseInt(selected),
                "resourceId": parseInt(selectedRes),
                "day": weekArray[startDay]
            }

        const response = await fetchRateCalendarLocationData(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);
        const {
            data = []

        } = response;

        console.log(data);

        // var startOfDay = new Date(startDateTime).getDay();
        // console.log(startOfDay);
        // var endOfTime = new Date(new Date(endDateTime).setDate(new Date(endDateTime).getDate() - 1));
        // var endOfDay = endOfTime.getDay();
        // console.log(endOfDay);

        const defaultRates = data.filter(rate => {
            return rate.startTime == null && rate.endTime == null;
        })

        // var start = new Date(startDateTime);
        // var end = new Date(endDateTime)
        // let dateArray = [];
        // while (start < end) {
        //     //console.log(start);
        //     var startDate = (new Date(start - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
        //     startDate = startDate.replace('T', ' ');
        //     startDate = startDate.substring(0, 19);
        //     dateArray.push(startDate);
        //     start.setDate(start.getDate() + 1);
        // }
        const globalFilterRates = data.filter(rate => {
            return rate.startTime == null && rate.endTime == null;
        })

        // console.log(globalFilterRates);

        // var startTime = new Date(startDateTime);
        // var endTime = new Date(endDateTime);

        const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        const newDefaultRates = defaultRates.map(rateElement => {
            let daysofweek = [];
            daysofweek.push(weekDays.indexOf(rateElement.day));
            console.log(daysofweek)
            return {
                ...rateElement,
                title: rateElement.rate,
                daysOfWeek: daysofweek,
                rendering: "background",
                "color": "#3399ff"
            }
        })

        var startTime = new Date(startDateTime);
        var endTime = new Date(endDateTime)

        let dateRateArray = [];
        while (startTime <= endTime) {
            //console.log(start);
            var startDate = (new Date(startTime - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19);
            //console.log(startDate);
            dateRateArray.push(startDate);
            startTime.setMinutes(startTime.getMinutes() + 30);
        }

        let newDateArray = [];
        newDateArray = timeSlotUnit !== "DAY" && dateRateArray
        console.log(newDateArray);
        let finalArr = [];
        finalArr = timeSlotUnit !== "DAY" && ratesRateCalendarDefault(data, newDateArray, timeSlotUnit);
        console.log(finalArr);

        dispatch({
            type: types.RATE_LOCATION_DATA,
            payload: {
                ...response.data.data,
                rates: timeSlotUnit === "DAY" ? newDefaultRates : finalArr,
                globalRates: globalFilterRates
            }
        });
    }
}

export const ratesRateCalendarDefault = (rates, dateArray, timeSlotUnit) => {

    let global = [];
    let specifics = [];

    const newDateArray = dateArray.map(date => {
        return date.substring(11, 19);
    })

    console.log(newDateArray);

    rates.forEach(rate => {
        if (rate.startTime !== null && rate.endTime !== null) {
            return specifics.push(rate);
        }
        global.push(rate);
    });

    console.log(global);
    console.log(specifics);

    let result = [];

    const getSpecificRate = (date, resourceId) => {
        return specifics.find(rate => {
            if (rate.resourceId !== parseInt(resourceId)) {
                return false;
            }

            const dateObj = new Date(date);
            const startTime = new Date(dateArray[newDateArray.indexOf(rate.startTime)]);
            const endTime = new Date(dateArray[newDateArray.indexOf(rate.endTime)]);
            if (dateObj >= startTime && dateObj < endTime) {
                return true;
            }

            return false;
        });
    }

    global.forEach(globalRate => {
        const list = dateArray.slice(0, dateArray.length - 1).map((date, index) => {
            let daysofweek = [];
            daysofweek.push(new Date(date).getDay())
            const specific = getSpecificRate(date, globalRate.resourceId);
            if (specific) {
                return {
                    ...specific,
                    title: specific.rate,
                    "rendering": "background",
                    "color": "#3399ff",
                    startTime: date.substring(11, 19),
                    endTime: newDateArray[index + 1],
                    daysOfWeek: daysofweek
                }
            }

            else {
                return {
                    ...globalRate,
                    title: globalRate.rate,
                    "rendering": "background",
                    "color": "#b3e6ff",
                    startTime: date.substring(11, 19),
                    endTime: newDateArray[index + 1],
                    daysOfWeek: daysofweek
                }

            }

        });

        result = result.concat(list);
    });

    console.log(result);

    return result;



    // rates.forEach(rate => {
    //     if (rate.startTime !== null) {
    //         return specifics.push(rate);
    //     }
    //     global.push(rate);
    // });

    // let result = [];

    // const getSpecificRate = (date, resourceId) => {
    //     return specifics.find(rate => {
    //         if (rate.resourceId !== resourceId) {
    //             return false;
    //         }

    //         const weekArrayObject = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    //         let dateModifiedArray = [];
    //         timeSlotUnit === "DAY" ? dateArray.map(date => {
    //             let day = new Date(date);
    //             let dayObj = day.getDay();
    //             //console.log(dayObj);
    //             dateModifiedArray.push(weekArrayObject[dayObj]);
    //         }) : dateArray;

    //         const filterModifiedArray = timeSlotUnit === "DAY" ? dateModifiedArray : dateArray;
    //         //console.log(filterModifiedArray);

    //         const dateObj = new Date(dateArray[filterModifiedArray.indexOf(rate.day)]);

    //         const endOfTime = new Date(new Date(dateArray[6]).setDate(new Date(dateArray[6]).getDate() + 1))
    //         //console.log(endOfTime);

    //         const startTime = timeSlotUnit === "DAY" ? dateObj : new Date(rate.startTime);
    //         console.log(startTime);
    //         const endTime = timeSlotUnit === "DAY" ? endOfTime : new Date(rate.endTime);
    //         console.log(endTime);

    //         if (dateObj >= startTime && dateObj < endTime) {
    //             console.log("1");
    //             return true;
    //         }

    //         return false;
    //     })
    // }


    // global.forEach(globalRate => {
    //     const list = dateArray.slice(0, dateArray.length - 1).map((date, index) => {
    //         const specific = getSpecificRate(date, globalRate.resourceId);
    //         if (specific) {
    //             return {
    //                 ...specific,
    //                 title: specific.rate,
    //                 "rendering": "background",
    //                 "color": "#3399ff",
    //                 resourceIds: specific.resourceId,
    //                 start: timeSlotUnit === "DAY" ? date.substring(0, 10) : date,
    //                 end: timeSlotUnit === "DAY" ? dateArray[index + 1].substring(0, 10) : dateArray[index + 1]
    //             }
    //         }

    //         else {
    //             return {
    //                 title: globalRate.rate,
    //                 "rendering": "background",
    //                 "color": "#b3e6ff",
    //                 resourceIds: globalRate.resourceId,
    //                 start: timeSlotUnit === "DAY" ? date.substring(0, 10) : date,
    //                 end: timeSlotUnit === "DAY" ? dateArray[index + 1].substring(0, 10) : dateArray[index + 1]
    //             }

    //         }

    //     });

    //     result = result.concat(list);
    // });

    // console.log(result);

    // return result;
}


export const ratesDefault = (rates, dateArray, timeSlotUnit) => {
    let rateDefaultArray = [];

    let global = [];
    let specifics = [];

    rates.forEach(rate => {
        if (rate.id) {
            return specifics.push(rate);
        }
        global.push(rate);
    });

    let result = [];

    const getSpecificRate = (date, resourceId) => {
        return specifics.find(rate => {
            const {
                resourceId: rateResourceIds,
                startDateTime,
                endDateTime
            } = rate;
            for (let i = 0; i < resourceId.length; i++) {
                if (rateResourceIds[i] !== resourceId[i]) {
                    return false;
                }
            }

            const dateObj = new Date(date);
            const startTime = new Date(startDateTime);
            const endTime = new Date(endDateTime);
            //console.log(endTime);
            if (dateObj >= startTime && dateObj < endTime) {
                //console.log("1");
                return true;
            }

            return false;
        });
    }

    global.forEach(globalRate => {
        const list = dateArray.slice(0, dateArray.length - 1).map((date, index) => {
            const specific = getSpecificRate(date, globalRate.resourceId);
            if (specific) {
                return {
                    ...specific,
                    title: specific.rate,
                    "rendering": "background",
                    "color": "#3399ff",
                    resourceIds: specific.resourceId,
                    start: timeSlotUnit === "DAY" ? date.substring(0, 10) : date,
                    end: timeSlotUnit === "DAY" ? dateArray[index + 1].substring(0, 10) : dateArray[index + 1]
                }
            }

            else {
                return {
                    title: globalRate.rate,
                    "rendering": "background",
                    "color": "#b3e6ff",
                    resourceIds: globalRate.resourceId,
                    start: timeSlotUnit === "DAY" ? date.substring(0, 10) : date,
                    end: timeSlotUnit === "DAY" ? dateArray[index + 1].substring(0, 10) : dateArray[index + 1]
                }

            }

        });

        result = result.concat(list);
    });

    console.log(result);

    return result;
}

export const checkAvailability = (selectedLoc, resources, formData, form, resourceList) => {
    return async (dispatch, getStore) => {

        console.log(selectedLoc);
        console.log(resources);
        console.log(formData);
        console.log(form);
        let resourceId = [];
        let newResourceId = [];
        resourceId = resources.map(res => {
            if (parseInt(formData.resource.id) === parseInt(res.id)) {
                resourceId.push(res.id);
            }
            newResourceId = resourceId;
        })

        var startTime = (new Date(formData.start - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19);
        var endTime = (new Date(formData.end - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).replace('T', ' ').substring(0, 19);

        console.log(resourceList);

        let addOn = [];
        let newAddOn = [];
        let newForm = [];
        newForm = form;
        addOn = newForm.type.map(addon => {
            if (addon && addon.id) {
                addOn.push({
                    "addonId": addon.id,
                    "qty": parseInt(addon.value)
                })
            }
            console.log(addOn);
            newAddOn = addOn;
        })
        var serverObj = {
            "verticalId": 1,
            "locationId": selectedLoc,
            "resourceId": newResourceId,
            "startDateTime": startTime,
            "endDateTime": endTime,
            "query": {
                "Max Guests": form.type[4].value,
                "Max Kids": form.type[5].value
            },
            "addons": newAddOn
        }

        console.log(serverObj);

        const response = await fetchBookingData(serverObj);
        if (!response.isSuccess) {
            return;
        }

        console.log(response);

        dispatch({
            type: types.BOOKING_DATA,
            payload: {
                ...response.data,
                price: response.price,
                count: response.resourceAvailableCount
            }
        });
    }
}