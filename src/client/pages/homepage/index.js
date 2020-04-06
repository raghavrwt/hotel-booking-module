
import React from 'react';
import loadable from '@loadable/component';
import {
	initializeMenu,
} from '../../actions/menu';

export default {
	component: loadable(() => import(/* webpackChunkName: "homepage" */'./HomePage'), {
		fallback: <div>Loading...</div>
	}),
	clientData: store => store.dispatch(initializeMenu())
};