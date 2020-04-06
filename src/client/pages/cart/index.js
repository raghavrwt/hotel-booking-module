import React from 'react';
import loadable from '@loadable/component';
import { setCartData } from '../../actions/cart';

export default {
	component: loadable(() => import(/* webpackChunkName: "listing" */'./Cart'), {
		fallback: <div>Loading...</div>
	}),
	clientData: store => store.dispatch(setCartData())
};