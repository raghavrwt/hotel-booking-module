
import React from 'react';
import loadable from '@loadable/component';

export default {
    component: loadable(() => import(/* webpackChunkName: "homepage" */'./CalendarPage'), {
        fallback: <div>Loading...</div>
    }),
    clientData: () => Promise.resolve()
};