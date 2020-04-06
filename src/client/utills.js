import { matchRoutes } from 'react-router-config';
import axios from 'axios';
import Routes from './Routes';
import { getStore } from '../store/createStore';

export const getMatchedRoutes = (path, options = {}) => {
	const routes = matchRoutes(Routes, path);
	return routes;
}

export const loadRouteData = (location, options = {}) => {
	const path = location.pathname;

	const store = getStore();
	const routes = getMatchedRoutes(path);
	if (!routes.length) {
		if (__isBrowser__) {
			return window.location.reload();
		} else {
			return Promise.resolve({
				notFoundPage: true
			});
		}
	}
	const matchedRoute = routes[0].route;
	const routeParams = routes[0].match.params;
	if (!__isBrowser__ && options.isLoggedIn && !matchedRoute.ignoreLogin) {
		return Promise.resolve({
			redirectToMyAccount: true,
			redirect: true
		});
	}
	const promises = routes
		.map(({ route }) => {
			let promiseArr = [];
			if (!options.loadType || options.loadType == 'clientData') {
				promiseArr.push(route.clientData ? route.clientData(store, routeParams, location) : null);
			}
			if (!options.loadType || options.loadType == 'loadData') {
				promiseArr.push(route.loadData ? route.loadData(store, routeParams, location) : null);
			}
			if (route.component.load) {
				promiseArr.push(route.component.load());
			}
			return Promise.all(promiseArr);
		})
		.map(promise => {
			if (!promise) {
				return null;
			}
			return new Promise(resolve => {
				const resolveCb = (data) => {
					resolve({
						...data,
						routeData: matchedRoute
					})
				}
				promise.then(resolveCb).catch(resolveCb);
			});
		});
	return Promise.all(promises);
};

export const setCookie = (cname, cvalue, exdays) => {
	let d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
};

export const removeDoubleBackSlash = obj => {
	if (typeof obj == 'string') {
		obj = obj.replace('//', '/');
		return obj;
	}
	return null;
};

export const getParameterByName = name => {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
	return results === null
		? ''
		: decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const getHighlightString = attrs => {
	var regToReplace = /(\]| |\[|\\|\(|\)|\+|\*|\.)/g,
		newString = attrs.searchKey.replace(/\s\s+/g, ' '),
		className = attrs.className || 'search-highlight';
	var array = [];
	if (newString) {
		array = newString.split(regToReplace);
		array = array.filter(function (ele) {
			return !regToReplace.test(ele);
		});
	}

	var textToMatch = attrs.searchResult;
	var reg = new RegExp(array.join('|'), 'gi');
	var searchedItems = textToMatch.match(reg);
	var replacedItems = [];
	if (searchedItems) {
		searchedItems.sort(function (a, b) {
			/* Sorting into descending order -
						  The word having 1 or 2 characters length also matches within the bigger words
						  issue: -
							  How Can I assign

							  How Can I assign
									  ^	 ^

					  */
			return a.length < b.length;
		});
		for (var i = 0; i < searchedItems.length; i++) {
			var curItem = searchedItems[i];
			if (curItem && replacedItems.indexOf(curItem) == -1) {
				replacedItems.push(curItem);
				let reg = new RegExp(curItem, 'gi');
				textToMatch = textToMatch.replace(reg, function (a, b) {
					return '@#$' + a + '$#@';
				});
			}
		}
		textToMatch = textToMatch.replace(
			/\@\#\$/g,
			"<span class='" + className + "'>"
		);
		textToMatch = textToMatch.replace(/\$\#\@/g, '</span>');
	}
	return textToMatch;
};

export const convertNumberToWords = amount => {
	var words = new Array();
	words[0] = '';
	words[1] = 'One';
	words[2] = 'Two';
	words[3] = 'Three';
	words[4] = 'Four';
	words[5] = 'Five';
	words[6] = 'Six';
	words[7] = 'Seven';
	words[8] = 'Eight';
	words[9] = 'Nine';
	words[10] = 'Ten';
	words[11] = 'Eleven';
	words[12] = 'Twelve';
	words[13] = 'Thirteen';
	words[14] = 'Fourteen';
	words[15] = 'Fifteen';
	words[16] = 'Sixteen';
	words[17] = 'Seventeen';
	words[18] = 'Eighteen';
	words[19] = 'Nineteen';
	words[20] = 'Twenty';
	words[30] = 'Thirty';
	words[40] = 'Forty';
	words[50] = 'Fifty';
	words[60] = 'Sixty';
	words[70] = 'Seventy';
	words[80] = 'Eighty';
	words[90] = 'Ninety';
	amount = amount.toString();
	var atemp = amount.split('.');
	var number = atemp[0].split(',').join('');
	var n_length = number.length;
	var words_string = '';
	if (n_length <= 9) {
		var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
		var received_n_array = new Array();
		for (var i = 0; i < n_length; i++) {
			received_n_array[i] = number.substr(i, 1);
		}
		for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
			n_array[i] = received_n_array[j];
		}
		for (var i = 0, j = 1; i < 9; i++ , j++) {
			if (i == 0 || i == 2 || i == 4 || i == 7) {
				if (n_array[i] == 1) {
					n_array[j] = 10 + parseInt(n_array[j]);
					n_array[i] = 0;
				}
			}
		}
		var value = '';
		for (var i = 0; i < 9; i++) {
			if (i == 0 || i == 2 || i == 4 || i == 7) {
				value = n_array[i] * 10;
			} else {
				value = n_array[i];
			}
			if (value != 0) {
				words_string += words[value] + ' ';
			}
			if (
				(i == 1 && value != 0) ||
				(i == 0 && value != 0 && n_array[i + 1] == 0)
			) {
				words_string += 'Crores ';
			}
			if (
				(i == 3 && value != 0) ||
				(i == 2 && value != 0 && n_array[i + 1] == 0)
			) {
				words_string += 'Lakhs ';
			}
			if (
				(i == 5 && value != 0) ||
				(i == 4 && value != 0 && n_array[i + 1] == 0)
			) {
				words_string += 'Thousand ';
			}
			if (
				i == 6 &&
				value != 0 &&
				(n_array[i + 1] != 0 && n_array[i + 2] != 0)
			) {
				words_string += 'Hundred & ';
			} else if (i == 6 && value != 0) {
				words_string += 'Hundred ';
			}
		}
		words_string = words_string.split('  ').join(' ');
	}
	if (words_string != '') {
		return words_string + 'only';
	} else {
		return '';
	}
};

export const indNumberFormat = (num) => {
	num = num.toString();
	var afterPoint = '';
	if (num.indexOf('.') > 0)
		afterPoint = num.substring(num.indexOf('.'), num.length);
	num = Math.floor(num);
	num = num.toString();
	var lastThree = num.substring(num.length - 3);
	var otherNumbers = num.substring(0, num.length - 3);
	if (otherNumbers != '')
		lastThree = ',' + lastThree;
	var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
	return res;
}

export const Regex = {
	websiteRegex: /^((https?):\/\/)?(www.)?([a-zA-Z0-9]{2,})+\.[a-zA-Z0-9]+(\.?[a-zA-Z0-9]?)+\/?([a-zA-Z0-9#]+\/?)*$/,
	urlRegex: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
};

export const bodyScrollHandler = (isStop) => {
	const overlyScrolHandler = ScrollHandlerService.getInstance();
	if (isStop) {
		overlyScrolHandler.stopScroll();
	} else {
		overlyScrolHandler.startScroll();
	}
}

const ScrollHandlerService = (function () {
	let instance;
	return {
		getInstance: function () {
			if (!instance) {
				instance = new ScrollHandler();
			}
			return instance;
		}
	};
})();

function ScrollHandler() {
	let count = 0;
	this.stopScroll = function (dataObj) {
		dataObj = dataObj || {};
		var deviceType = getDeviceType();
		dataObj.scrollingEle = dataObj.scrollingEle || window;
		this.scrollingEle = dataObj.scrollingEle;
		// this.classAdded = deviceType == 'WEB' ? 'stop-body-scroll' : 'stop-scrollWithPosFixed';
		this.classAdded = 'stop-body-scroll';
		if (this.scrollingEle) {
			var operatedEle = document.body;
			if (count == 0) {
				this.currentScrollTop = this.scrollingEle.pageYOffset;
				operatedEle.classList.add(this.classAdded);
			}
			count++;
		}
	}
	this.startScroll = function () {
		if (this.scrollingEle) {
			count--;
			if (count == 0) {
				document.body.classList.remove(this.classAdded);
			}
		}
	}
}

const getDeviceType = function () {
	if (window && window.jdInterface && window.jdInterface.isIOSApp) {
		return "IOSAPP";
	} else if (window && window.jdInterface) {
		return "ANDROIDAPP"
	} else if (/(iPad|iPhone|iPod|CriOS)/g.test(navigator.userAgent)) {
		return "IOSBROWSER";
	} else if (/mobile/i.test(navigator.userAgent)) {
		return "MOBILE";
	} else {
		return "WEB";
	}
}

export const autoLogout = async () => {
	const res = await axios.get("/marketplace/static/php/web/common_api.php?action=getAutoLoginUrl");
	const data = res.data;
	var onloadCount = 0;
	if(data.autoLogoutUrlList){
		var logoutLinksArray = data.autoLogoutUrlList.split(",");
		for(var i = 0 ; i < logoutLinksArray.length ; i++){
			var logoutByImage = new Image();
			logoutByImage.src = logoutLinksArray[i];
			logoutByImage.style.visibility = "hidden";
			logoutByImage.style.position="fixed";
			onloadCount += 1;
			logoutByImage.onload = automaticlogout;
			logoutByImage.onerror = automaticlogout;
			document.body.appendChild(logoutByImage);
		}
	}
	function automaticlogout(){
		onloadCount--;
		if(!onloadCount){
			window.location.reload();
		}
	}
}