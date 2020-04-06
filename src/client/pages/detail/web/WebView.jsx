import React from 'react';
import styles from '../detail.scss';
import LeftSection from './LeftSection';
import BookingForm from '../../../common/BookingForm/BookingForm';

const WebView = props => {
    return (
        <>
            <LeftSection
                className={styles['left-section']}
                data={props.data}
            />
            <div className={styles['right-section']} >
                <div className={styles['price-container']}>
                    ${props.price}
                </div>
                <BookingForm
                    onBook={props.onBook}
                    className={styles['detail-form']}
                />
            </div>
        </>
    );
}

export default WebView;