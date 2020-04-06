import React from 'react';
import SideBar from './SideBar/SideBar';
import Page from './Page';
import styles from './home-page.scss';

const HomePage = (props) => {
	return (
		<div className={styles['home-page']}>
			<SideBar />
			<Page />
		</div>
	);
};

export default HomePage;
