import React from 'react';
import styles from './page-container.scss';

const PageContainer = props => {
    return (
        <div className={`${styles['background-container']}`}>
            <div className={`${styles['page-container']} ${props.className}`}>
                {props.children}
            </div>
        </div>
    )
}

PageContainer.defaultProps = {
    className: ''
}

export default PageContainer;