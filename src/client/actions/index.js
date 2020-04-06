import types from './types';

export const setDeviceData = payload => ({
	type: 'SET_DEVICE_DATA',
	payload
});

export const setUserData = payload => ({
	type: types.INITIALIZE_USER_DATA,
	payload
});