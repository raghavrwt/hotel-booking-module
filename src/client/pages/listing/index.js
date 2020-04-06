import React from 'react';
import loadable from '@loadable/component';
import { initialize } from '../../actions/listing';
import { setCartData } from '../../actions/cart';

export default {
	component: loadable(() => import(/* webpackChunkName: "listing" */'./Listing'), {
		fallback: <div>Loading...</div>
	}),
	clientData: (store, params, location) => {
		return Promise.all([
			store.dispatch(initialize(location.search)),
			store.dispatch(setCartData()),
		]);
	}
};