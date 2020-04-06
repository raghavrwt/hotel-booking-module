import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { loadRouteData } from './utills';
import Loader from './common/Loader/Loader';
import Routes from './Routes';
import { isUrlDifferent } from 'jd-library';
import { matchRoutes } from 'react-router-config';

class PendingNavDataLoader extends Component {
	constructor(props) {
		super(props);
		const hasClientData = this.hasClientData();
		this.state = {
			previousLocation: null,
			currentLocation: this.props.location,
			showRoute: !hasClientData,
			showLoader: hasClientData
		};
	}

	static getDerivedStateFromProps(props, state) {
		const currentLocation = props.location;
		const previousLocation = state.currentLocation;

		const navigated = isUrlDifferent(currentLocation, previousLocation);
		if (navigated) {
			// save the location so we can render the old screen
			const routes = matchRoutes(Routes, props.location.pathname);
			const noLoader = routes[0] && routes[0].route.noLoader;

			return {
				previousLocation,
				currentLocation,
				showLoader: !noLoader
			};
		}

		return null;
	}


	componentDidMount() {
		if (!this.props.showRoute) {
			loadRouteData(this.props.location, {
				loadType: 'clientData'
			})
				.then(() => {
					this.setState({
						showRoute: true,
						showLoader: false
					});
				});
		}
	}

	componentDidUpdate(prevProps) {
		const navigated = isUrlDifferent(prevProps.location, this.props.location)
		if (navigated) {
			// load data while the old screen remains
			loadRouteData(this.props.location).then((data) => {
				// clear previousLocation so the next screen renders
				window.scrollTo(0, 0);
				this.setState({
					previousLocation: null,
					showLoader: false
				}, () => {

				});
			});
		}
	}

	hasClientData = () => {
		const routes = matchRoutes(Routes, this.props.location.pathname);
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].route.clientData) {
				return true;
			}
		}
		return false;
	}

	render() {
		const { children, location } = this.props;
		const { previousLocation } = this.state;

		// use a controlled <Route> to trick all descendants into
		// rendering the old location
		return (
			<>
				{this.state.showRoute && (
					<Route
						location={previousLocation || location}
						render={() => children}
					/>
				)}
				{this.state.showLoader ? (
					<Loader />
				) : null}
			</>
		);
	}
}

export default withRouter(PendingNavDataLoader);
