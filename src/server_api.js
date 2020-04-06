import renderer from './helpers/renderer';
import createStore from './store/createStore';
import { loadRouteData } from './client/utills';

import {
	setDeviceData,
	setUserData
} from './client/actions/index';
var Email = require('email-templates');
var path = require('path');
var url = require('url');
//require('./helpers/handlebarHelper');

exports.getHtml = async function (req) {
	const store = createStore();
	const context = {};
	const path = req.path;
	const parsedURL = url.parse(req.originalUrl)
	const data = await loadRouteData({
		pathname: path,
		search: parsedURL.query || ''
	}, {
		isLoggedIn: req.user ? true : false,
		loadType: 'loadData'
	})
	if (data.redirect) {
		return data;
	}

	store.dispatch(setDeviceData(req.jdUserAgent));
	store.dispatch(setUserData({
		supId: req.supId
	}));

	const content = renderer({
		req,
		store,
		context,
		data
	});
	return {
		...context,
		content,
		notFoundPage: data.notFoundPage
	}
};

exports.getEmailTemplate = function (options) {
	return new Promise(function (resolve, reject) {
		let email = new Email({
			views: {
				options: {
					extension: "hbs"
				}
			},
			juice: true,
			juiceResources: {
				preserveImportant: true,
				webResources: {
					relativeTo: path.join(
						__dirname,
						'helpers',
						"styles"
					)
				}
			}
		});
		let templateDir = path.join(
			__dirname,
			'..',
			'src',
			'helpers',
			options.templateType,
			"html"
		);
		let templateData = {
			...options.templateData
		};
		email.render(templateDir, templateData).then(function (html) {
			resolve({
				isError: false,
				html: html
			});
		}).catch(function (err) {
			resolve({
				isError: true
			});
		})
	});
};
