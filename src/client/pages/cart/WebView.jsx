import React from 'react';
import {useHistory} from 'react-router-dom';
import ItemList from './ItemList';
import RightSection from './RightSection';
import styles from './cart.scss';

const WebView = props => {
    const history = useHistory();
    return props.totalItems > 0 ? (
        <>
            <div className={styles['cart-left']}>
                <div className={styles['cart-header']}>
                    <span 
                        className={`icon-pagination-left ${styles['left-arrow']}`} 
                        onClick={() => history.goBack()}
                    />
                    Cart
                </div>
                <ItemList />
            </div>
            <RightSection />
        </>
    ) : 'No Items in Cart'
}

export default WebView;