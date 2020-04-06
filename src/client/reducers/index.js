import { combineReducers } from 'redux';
import deviceData from './device_data';
import menu from './menu';
import page from './page';
import userData from './userData';
import listing from './listing';
import detail from './detail';
import booking from './booking';
import cart from './cart';
import slots from './slots';

export default combineReducers({
	deviceData,
	menu,
	page,
	userData,
	listing,
	detail,
	booking,
	cart,
	slots
});
