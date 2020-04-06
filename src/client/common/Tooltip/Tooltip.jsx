import React from 'react';
import styles from './tooltip.scss';

const Tooltip = props => {

    return (
        <div className={styles['tooltip-container']}>
            <div className={`${styles['tooltip-icon']} icon-alertNew`} />
            <div className={styles['tooltip']}>
                {props.children}
            </div>
        </div>
    );
}

export default Tooltip;