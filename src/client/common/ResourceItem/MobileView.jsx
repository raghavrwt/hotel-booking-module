import React from 'react';
import styles from './resource-item.scss';
import {Link} from 'react-router-dom';
import { Button } from 'jd-library';

const MobileView = props => {
    let buttonHtml = null;

    switch(props.buttonType) {
        case 'button':
            buttonHtml = (
                <Button
                    {...props.button}
                    clickHandler={() => props.onBtnClick('button')}
                />
            );
            break;
        case 'quantity':
            buttonHtml = (
                <>
                    <span 
                        className={`icon-minusLine ${styles['minus-btn']} ${styles['qty-btn']}`}
                        onClick={() => props.onBtnClick('minus')} 
                    />
                    <div className={styles['qty']}>{props.button.qty}</div>
                    <span 
                        className={`icon-pluseLine ${styles['plus-btn']} ${styles['qty-btn']}`} 
                        onClick={() => props.onBtnClick('plus')}
                    />
                </>
            );
            break;
    }

    return (
        <div className={styles['resource-item']}>
            <div className={styles['left-section']}>
                <img 
                    src={props.image} 
                    className={styles['resource-image']}
                />
            </div>
            <div className={styles['right-section']}>
                {props.link ? (
                    <Link 
                        className={styles['resource-name']}
                        to={props.link}
                    >
                        {props.name}
                    </Link>
                ) : (
                    <div 
                        className={styles['resource-name']}
                    >
                        {props.name}
                    </div>
                )}
                {props.attrs.length > 0 ? (
                    <div className={styles['attrs-container']}>
                        {props.attrs}
                    </div>
                ) : null}
                <div className={styles['price-btn-container']}>
                    <div className={styles['price-container']}>
                        <div className={styles['price']}>
                            Rs. {props.price} 
                        </div>
                        {/* <div className={styles['rate-type']}>
                            {props.pricing.rateType}
                        </div> */}
                    </div>
                    <div className={`${styles['book-button']} type-${props.buttonType}`}>
                        {buttonHtml}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileView;