export default (state = {}, action) => {
	const payload = action.payload;
	switch (action.type) {
		case 'SET_DEVICE_DATA': {
			const stateObj = {
				isMobile: payload.isMobile || false,
				isIphone: payload.isIphone || false,
				isIpad: payload.isIpad || false,
				isIpadApp: payload.isIpadApp || false,
				isIphoneApp: payload.isIphoneApp || false,
				isAndroidApp: payload.isAndroidApp || false,
				isMacOS: payload.isMacOS || false,
				isChrome: payload.isChrome || false
			}

			stateObj.phpSource = getSourceDevice(stateObj);

			return stateObj;
		}
		case 'SET_SPLASH_SHOWN': {
			return {
				...state,
				splashShown: true
			};
		}
		default:
			return state
	}
}

export const getSourceDevice = (deviceData) => {
	if (deviceData.isAndroidApp) {
		return 'AndroidApp';
	} else if (deviceData.isIphoneApp) {
		return 'IosApp';
	} else if (deviceData.isIpadApp || deviceData.isIpad) {
		return 'IPadApp';
	}

	return deviceData.isMobile ? 'MobileBrowser' : 'WebBrowser';
}