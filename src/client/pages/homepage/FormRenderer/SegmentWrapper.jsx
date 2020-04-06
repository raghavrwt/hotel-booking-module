import React from 'react';
import styles from './segment.scss';

const SegmentWrapper = ({
    className='',
    title,
    sub_title,
    children
}) => {
    return (
        <div className={`${styles['segment']} ${className}`} >
            <div className={styles['segment-left']}>
                <div className={styles['segment-title']}>
                    {title}
                </div>
                <div className={styles['segment-sub-title']}>
                    {sub_title}
                </div>
            </div>
            <div className={styles['segment-body']}>
                {children}
            </div>
        </div>
    )
}

export default SegmentWrapper;