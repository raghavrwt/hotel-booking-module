import React from 'react';
import loadable from '@loadable/component';
import {
    initialize
} from '../../actions/detail';
import { setCartData } from '../../actions/cart';

export default {
    component: loadable(() => import(/* webpackChunkName: "detail" */'./Detail'), {
        fallback: <div>Loading...</div>
    }),
    clientData: (store, params, location) => {
        return Promise.all([
            store.dispatch(initialize({
                verticalId: Number(params.verticalId),
                resourceId: Number(params.resourceId),
                locationId: Number(params.locationId),
                search: location.search
            })),
            store.dispatch(setCartData())
        ]);
    }
};