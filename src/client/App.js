import React from 'react';
import { renderRoutes } from 'react-router-config';
import Routes from './Routes';
import RouteLoader from './RouteLoader';

const App = props => {
	return (
		<div>
			<RouteLoader>{renderRoutes(Routes)}</RouteLoader>
		</div>
	);
};

export default App;
