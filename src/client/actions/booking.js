import types from './types';
import axios from 'axios';

const updateQuery = ({ index, value, params, isAttribute = false }) => {
    return async (dispatch, getStore) => {
        const {
            userData: {
                verticalId
            },
            booking: {
                query,
                searchForm,
                addons
            }
        } = getStore();

        let newQuery = query;
        let newAddons = addons;

        if (isAttribute) {
            newAddons = [...addons];
            newAddons[index].value = value;
        } else {
            const attr = searchForm[index];
            let paramId = query[attr.name].paramId;

            if (attr.type === 'DROPDOWN') {
                const selectedVal = attr.data.find(val => val.value === value);
                if (selectedVal) {
                    paramId = selectedVal.id;
                }
            }

            newQuery = { ...query };
            newQuery[attr.name] = {
                paramId,
                paramValue: value
            };
        }

        const {
            status,
            data
        } = await axios.post(
            '/omni_bookings/customer/getResourceAvailable.ns',
            {
                verticalId,
                resourceId: Number(params.resourceId),
                locationId: newQuery['Location'].paramId,
                startDateTime: newQuery['Start Date'].paramValue,
                endDateTime: newQuery['End Date'].paramValue,
                addons: newAddons.map(addon => ({
                    addonId: addon.id,
                    qty: addon.value
                }))
            }
        );

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        dispatch({
            type: types.UPDATE_BOOKING_INFO,
            payload: {
                query: newQuery,
                price: data.price,
                addons: newAddons,
                resourceAvailable: data.resourceAvailableCount > 0
            }
        });
    }
}

export const showBookingModal = (selectedResource) => {
    return (dispatch) => {
        dispatch({
            type: types.SHOW_BOOKING_MODAL,
            payload: {
                modal: {
                    show: true
                },
                selectedResource,
                resourceId: selectedResource ? selectedResource.id : null
            }
        });
    }
}

export const hideBookingModal = () => {
    return (dispatch) => {
        dispatch({
            type: types.HIDE_BOOKING_MODAL
        })
    }
}

export const updateBookingInfo = ({ queryObj = {}, priceList, availableList, addons, setIndex, cb }) => {
    return async (dispatch, getStore) => {
        const {
            userData: {
                verticalId
            },
            booking: {
                query,
                resourceId
            }
        } = getStore();

        const {
            status,
            data
        } = await axios.post(
            '/omni_bookings/customer/getResourceAvailable.ns',
            {
                verticalId,
                resourceId: [resourceId],
                locationId: Number(query['Location'].paramId),
                startDateTime: queryObj['Start Date'],
                endDateTime: queryObj['End Date'],
                addons
            }
        );

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        const totalPrice = priceList.reduce((sum, price, index) => {
            const val = index === setIndex ? data.price : price;
            return sum + val;
        }, 0);

        const resourceAvailable = availableList.reduce((available, availability, index) => {
            const val = index === setIndex ? data.resourceAvailableCount > 0 : availability;
            return available && val;
        }, true);

        dispatch({
            type: types.UPDATE_BOOKING_INFO,
            payload: {
                price: totalPrice,
                resourceAvailable
            }
        });

        cb && cb(data.price, data.resourceAvailableCount > 0);
    }
}

export const updatePriceAndAvailablity = (priceList, availableList) => {
    const totalPrice = priceList.reduce((sum, price, index) => {
        return sum + price;
    }, 0);

    const resourceAvailable = availableList.reduce((available, availability, index) => {
        return available && availability;
    }, true);

    return {
        type: types.UPDATE_AVAILABILITY_AND_PRICE,
        payload: {
            price: totalPrice,
            resourceAvailable
        }
    };
}