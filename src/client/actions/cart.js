import axios from 'axios';
import types from './types';
import {serverDateTimeFormat, cartServerFormat} from '../common/dateFunctions';
import {parse, format} from 'date-fns';

export const setCartData = () => {
    return async (dispatch, getStore) => {
        const {
            userData: {
                verticalId
            }
        } = getStore();

        const {
            status,
            data
        } = await axios.post('/omni_bookings/cart/getCartItems.ns', { verticalId });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        dispatch({
            type: types.SET_CART_DATA,
            payload: {
                items: data.cartItems
            }
        });
    }
}

export const addToCart = (items, cb) => {
    return async (dispatch, getStore) => {
        const {
            booking: {
                query,
                resourceId
            },
            userData: {
                verticalId
            }
        } = getStore();

        const locationId = query['Location'].paramId;
        const data = {
            verticalId,
            cartData: items.map(item => ({
                ...item,
                resourceGroup: item.dependantId ? [locationId, resourceId, item.dependantId] : [locationId, resourceId]
            }))
        }

        const {
            status,
            data: response
        } = await axios.post('/omni_bookings/cart/addToCart.ns', data);

        if (status !== 200 || !response.isSuccess) {
            return;
        }

        dispatch({
            type: types.ADD_TO_CART,
            payload: {
                items: data.cartData.map((item, index) => {
                    //to be removed later
                    const startObj = parse(item.startDate, cartServerFormat, new Date());
                    const endObj = parse(item.endDate, cartServerFormat, new Date());

                    return {
                        ...item,
                        id: response.cartIds[index],
                        startDate: format(startObj, serverDateTimeFormat) + '.000Z',
                        endDate: format(endObj, serverDateTimeFormat) + '.000Z'
                    }
                })
            }
        });

        cb && cb(response);
    }
}

export const deleteFromCart = ({ resourceId, cartId }) => {
    return async (dispatch, getStore) => {
        const {
            cart: {
                items
            },
            booking: {
                query
            }
        } = getStore();

        let itemToDelete = {};
        let index = -1;

        if (typeof cartId === 'undefined' && resourceId) {
            const locationId = query['Location'].paramId;

            items.forEach((item, itemIndex) => {
                const [itemLocation, itemResourceId] = item.resourceGroup;

                if (itemLocation === locationId && itemResourceId === resourceId) {
                    index = itemIndex;
                }
            });
        } else {
            index = items.findIndex(item => item.id === cartId);
        }

        if (index !== -1) {
            itemToDelete = { ...items[index] };
        }

        const {
            status,
            data
        } = await axios.post('/omni_bookings/cart/deleteFromCart.ns', { cartId: itemToDelete.id });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        dispatch({
            type: types.DELETE_FROM_CART,
            payload: index
        });
    }
}