import config from '../config/config'
__webpack_public_path__ = `${config.staticDomains[0]}${config.publicPath}`;
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { Provider } from 'react-redux';
import AppProvider from './context/AppProvider';
import App from './App';
import createStore from '../store/createStore';
import './common/common.scss';
import '../font/omni-fonts/style.css';
import '../font/webstore/style.css';
import "react-datepicker/dist/react-datepicker.css";
import "tinymce/skins/ui/oxide/skin.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const state = window.PRELOADED_STATE;
delete window.PRELOADED_STATE;
const store = createStore(state);

const WrappedApp = (
	<Provider store={store}>
		<AppProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AppProvider>
	</Provider>
);

loadableReady(() => {
	ReactDOM.hydrate(WrappedApp, document.querySelector('#root'));
});