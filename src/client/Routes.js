import HomePage from './pages/homepage';
import Listing from './pages/listing';
import Detail from './pages/detail'
import Cart from './pages/cart';
import OrderConfirmation from './pages/order-confirmation';
import OrderFailure from './pages/order-confirmation/OrderFailure';

export default [
	{
		...HomePage,
		exact: true,
		path: '/'
	},
	{
		...Listing,
		exact: true,
		path: '/listing'
	},
	{
		...Detail,
		exact: true,
		path: '/detail/:resourceName/:verticalId-:locationId-:resourceId'
	},
	{
		...Cart,
		exact: true,
		path: '/cart'
	},
	{
		...OrderConfirmation,
		exact: true,
		path: '/order-confirmation'
	},
	{
		component: OrderFailure,
		exact: true,
		path: '/order-failure'
	}
];
