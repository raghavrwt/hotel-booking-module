import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import App from '../client/App';
import NotFound from '../client/NotFound';
const home = require('./home.hbs');
import config from '../config/config.server';
const stats = require('../../build/dev.loadable-stats.json');
let prodStats = null;
try{
	prodStats = require('../../build/loadable-stats.json');
}catch(e){
	console.log("NO PRODUCTION STATS")
}

export default (options) => {
	const {req, store, context,data} = options; 
	let entrypoints = ['main'];
	let app = null;
	const state = store.getState();
	if(data.notFoundPage){
		app = (
			<NotFound />
		)
		entrypoints = ['error-page'];
	}else{
		console.log("HIMANSHU")
		app = (
			<App />
		)
	}
	const extractor = new ChunkExtractor({ 
		stats : config.environment != 'production' || req.query.isDev == 1 ? stats : prodStats,
		publicPath : config.staticDomains[0] + config.publicPath,
		entrypoints
	});
	const jsx = extractor.collectChunks(
		<Provider store={store}>
			<StaticRouter location={req.originalUrl} context={context}>
				{app}
			</StaticRouter>
		</Provider>
	);
	const content = renderToString(jsx);
	
	const hbsData = {
		content: content,
		preloadData: serialize(state).replace(/</g, '\\u003c'),
		jsFiles: extractor.getScriptTags(),
		cssFiles: extractor.getStyleTags(),
	};
	return home(hbsData);
};
