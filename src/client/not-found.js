import config from '../config/config'
__webpack_public_path__ = `${config.staticDomains[0]}${config.publicPath}`;
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { Provider } from 'react-redux';
import NotFound from './NotFound';
import createStore from '../store/createStore';

const state = window.PRELOADED_STATE;
delete window.PRELOADED_STATE;
const store = createStore(state);

const WrappedApp = (
	<Provider store={store}>
		<BrowserRouter
			forceRefresh={true}
		>
			<NotFound />
		</BrowserRouter>
	</Provider>
);

loadableReady(() => {
	ReactDOM.hydrate(WrappedApp, document.querySelector('#root'));
});