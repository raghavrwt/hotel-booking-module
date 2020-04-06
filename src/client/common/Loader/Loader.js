'use strict';

import React from 'react';
import styles from './loader.scss';

export default class Loader extends React.Component{
	render(){
		const styleObj = this.props.style || {};
		const className = this.props.className || "";
		let extraProps = {};
		if(this.props.id){
			extraProps.id = this.props.id;
		}
		return (
			<div
				className={`${styles["mobile-loader"]} ${className}`}
				{...extraProps}
				style={styleObj}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className={styles["svg-wrapper"]}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
						<circle cx="12px" cy="12px" r="9px" className={styles["circle"]} />
					</svg>
				</div>
			</div>
		)
	}
}