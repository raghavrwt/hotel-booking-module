import axios from 'axios';
import config from '../../config/config';
import { ratesDefault } from '../actions/page.js'

export const fetchMenu = (verticalId) => {
    return axios.get('/omni_bookings/vendor/getMenu.ns').then(response => {
        if (response.status !== 200) {
            return {
                isSuccess: false
            }
        }

        return response.data;
    });
}

const fetchFormData = ({ menuId, resourceId }) => {
    return axios.post('/omni_bookings/vendor/getMenuStructureAndData.ns', { menuId, resourceId }).then(response => {
        if (response.status !== 200) {
            return {
                isSuccess: false
            }
        }

        return response.data;
    });
}

const fetchCalendarData = async ({ menuId }) => {
    const response = await axios.post('/omni_bookings/calendar/getAllResourcesByMenuId.ns', { menuId });

    if (response.status !== 200) {
        return {
            isSuccess: false
        }
    }
    const {
        data: {
            location = [],
            resource = [],
        }
    } = response.data;

    const newLocation = location.map(loc => ({
        ...loc,
        title: loc.name
    }));

    const newResource = resource.map(loc => ({
        ...loc,
        title: loc.name
    }));

    //console.log(newLocation, newResource);
    //blocked dates

    // var currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() - 2);
    // console.log(currentDate);
    // var curDate = (new Date(currentDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
    // curDate = curDate.replace('T', ' ');
    // curDate = curDate.substring(0, 10)+ "";
    // console.log(curDate);
    // var nextDate = new Date();
    // nextDate.setDate(nextDate.getDate() + 5);
    // console.log(nextDate);
    // var nDate = (new Date(nextDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
    // nDate = nDate.replace('T', ' ');
    // nDate = nDate.substring(0, 10) + " 00:00:00";
    // console.log(nDate);

    // var startDate = (new Date(currentDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
    // startDate = startDate.replace('T', ' ');
    // startDate = startDate.substring(0, 19);
    // console.log(startDate);
    // dateArray.push(startDate);

    // var serverObj = {
    //     "locationId": parseInt(newLocation[0].id),//parseInt(selected),
    //     "resourceId": parseInt(newResource[0].id),//parseInt(selectedRes),
    //     "startDateTime": currentDate,
    //     "endDateTime": nextDate
    // }
    // console.log(serverObj);

    // const res = await axios.post('/omni_bookings/calendar/getAllBookingsByLocation.ns', serverObj);
    // if (res.status !== 200) {
    //     return {
    //         isSuccess: false
    //     }
    // }

    // console.log(res);
    // const {
    //     data: {
    //         blockedDates = [],
    //         rates = [],
    //         bookings = []
    //     }
    // } = res.data;


    // const newBlockedDates = blockedDates.map(date => ({
    //     ...date,
    //     start: date.startDateTime,
    //     end: date.endDateTime,
    //     rendering: "background",
    //     color: "#333333",
    //     resourceIds: date.resourceId
    // }))

    // const newBookings = bookings.map(booking => ({
    //     ...booking,
    //     title: "Booked",
    //     start: booking.startDateTime.substring(0, 10),
    //     end: booking.endDateTime.substring(0, 10),
    //     resourceIds: booking.resourceId
    // }))

    // let dateArray = [];

    // while (currentDate <= nextDate) {
    //     //console.log(start);
    //     var startDate = (new Date(currentDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
    //     startDate = startDate.replace('T', ' ');
    //     startDate = startDate.substring(0, 19);
    //     console.log(startDate);
    //     dateArray.push(startDate);
    //     currentDate.setDate(currentDate.getDate() + 1);
    // }

    // console.log(dateArray);

    // let finalArr = [];
    // finalArr = ratesDefault(rates, dateArray);
    // console.log(finalArr);

    return {
        data: {
            ...response.data.data,
            location: newLocation,
            resource: newResource,
        }
        // rates: finalArr,
        // blockedDates: newBlockedDates,
        // bookings: newBookings
    };
}

const fetchRateCalendarData = async ({ menuId }) => {
    const response = await axios.post('/omni_bookings/calendar/getAllResourcesByMenuId.ns', { menuId });

    if (response.status !== 200) {
        return {
            isSuccess: false
        }
    }

    console.log(response);

    const {
        data: {
            location = [],
            resource = [],
        }
    } = response.data;

    const newLocation = location.map(loc => ({
        ...loc,
        title: loc.name
    }));

    const newResource = resource.map(loc => ({
        ...loc,
        title: loc.name
    }));

    return {
        data: {
            ...response.data.data,
            location: newLocation,
            resource: newResource,
        }
        // rates: finalArr,
        // blockedDates: newBlockedDates,
        // bookings: newBookings
    };

}



export const fetchPageData = async ({ menuId, resourceId, pageType = 'FORM' }) => {
    console.log(pageType);
    switch (pageType) {
        case 'FORM':
            return fetchFormData({ menuId, resourceId });
        case 'CALENDAR':
            return fetchCalendarData({ menuId });
        case 'RATE_CALENDAR':
            return fetchRateCalendarData({ menuId });
    }
}

export const saveResourceData = (data) => {
    return axios.post('/omni_bookings/vendor/saveResourceData.ns', data).then(response => {
        return response.data;
    });
}

export const fetchBookingData = (data) => {
    return axios.post('/omni_bookings/customer/getResourceAvailable.ns', data).then(response => {
        return response.data;
    });
}



export const fetchLocationData = (data) => {
    return axios.post('/omni_bookings/calendar/getAllBookingsByLocation.ns', data).then(response => {
        return response.data;
    })
}

export const fetchRateCalendarLocationData = (data) => {
    return axios.post('/omni_bookings/calendar/getAllWeeklyRatesByLocation.ns', data).then(response => {
        return response.data;
    })
}

export const saveBlockData = (data) => {
    return axios.post('/omni_bookings/calendar/blockResource.ns', data).then(response => {
        return response.data;
    });
}

export const deleteBlockData = (data) => {
    return axios.post('/omni_bookings/calendar/delete.ns', data).then(response => {
        return response.data;
    });
}

export const resetRateCalendarCustomRates = (data) => {
    return axios.post('/omni_bookings/calendar/delete.ns', data).then(response => {
        return response.data;
    });
}

export const resetCustomRates = (data) => {
    return axios.post('/omni_bookings/calendar/delete.ns', data).then(response => {
        return response.data;
    });
}

export const resetBookingDates = (data) => {
    return axios.post('/omni_bookings/calendar/delete.ns', data).then(response => {
        return response.data;
    });
}

export const saveRateData = (data) => {
    return axios.post('/omni_bookings/calendar/addRates.ns', data).then(response => {
        return response.data;
    });
}

export const saveRateCalendarData = (data) => {
    return axios.post('/omni_bookings/calendar/addWeeklyRates.ns', data).then(response => {
        return response.data;
    });
}

export const addBookingEvent = (data) => {
    return axios.post('/omni_bookings/calendar/addBooking.ns', data).then(response => {
        return response.data;
    });
}

export const saveBookingData = (data) => {
    return axios.post('/omni_bookings/customer/getSearchForm.ns', data).then(response => {
        return response.data;
    });
}

export const uploadImage = ({ file, supId, progressCb }) => {
    const data = new FormData();

    let requestConfig = {};

    if (progressCb) {
        requestConfig = {
            onUploadProgress: function (progressEvent) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(percentCompleted);
                // parent.setState({ uploadPerc: percentCompleted });
            }
        };
    }

    data.append('uploadedImageFile', file);

    return axios.post(
        `${config.apiDomains[0]}/marketplace/products/ajax/uploadProductImageForB2B.service?supplierId=${supId}`,
        data,
        requestConfig
    ).then(response => {
        return response.data;
    });
}

