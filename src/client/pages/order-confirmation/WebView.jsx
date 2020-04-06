import React from 'react';
import styles from './order-confirmation.scss';
import ItemList from './ItemList';
import {Button} from 'jd-library';

const WebView = props => {
    return (
        <>
            <div className={styles['container-left-section']}>
                <div className={`${styles['thank-you-title']} ${styles['content-container']}`}>
                    <div className={styles['icon-container']}>
                        {/* <div className={`icon-Checkmark ${styles['title-icon']}`} /> */}
                        <img 
                            src='https://image1.jdomni.in/jdomni_email/emptySuccessful_1903291502.png'
                            className={styles['title-img']}
                        />
                    </div>
                    <div className={styles['title-text']}>
                        Your bookings have been successfully placed!
                    </div>
                </div>
                <div className={`${styles['bookings']} ${styles['content-container']}`}>
                    <div className={styles['content-title']}>
                        Your Bookings
                    </div>
                    <div className={styles['content-body']}>
                        <ItemList />
                    </div>
                </div>
            </div>
            <div className={styles['container-right-section']}>
                <div className={`${styles['price-details']} ${styles['content-container']}`}>
                    <div className={styles['content-title']}>
                        Price Details
                    </div>
                    <div className={styles['content-body']}>
                        <div className={styles['price-row']}>
                            <div className={styles['price-title']}>
                                Amount Payable
                            </div>
                            <div>
                                Rs. {props.totalPrice}
                            </div>
                        </div>
                    </div>
                    <Button
                        className={styles['home-btn']}
                        block
                        size='lg'
                    >
                        GO TO HOME PAGE
                    </Button>
                </div>
            </div>
        </>
    )
}

export default WebView;