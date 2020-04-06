import React from 'react';
import loadable from '@loadable/component';
import {setCartData} from '../../actions/cart';

export default {
	component : loadable(() => import(/* webpackChunkName: "order-confirmation" */'./OrderConfirmation'),{
		fallback : <div>Loading...</div>
	}),
	clientData: (store, params, location) => {
		return Promise.all([
			store.dispatch(setCartData()),
		]);
	}
};