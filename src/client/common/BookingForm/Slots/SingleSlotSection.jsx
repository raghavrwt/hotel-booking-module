import React from 'react';
import DateList from './DateList';
import SlotList from './SlotList';
import styles from './slots.scss';

const SingleSlotSection = props => {
    return (
        <>
            <div className={styles['slot-section-header']}>
                {props.title}
            </div>
            
        </>
    )
}

export default SingleSlotSection;