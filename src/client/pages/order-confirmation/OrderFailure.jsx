import React from 'react';
import {connect} from 'react-redux';
import styles from './order-failure.scss';
import ClientHeader from '../../common/ClientHeader/ClientHeader';
import ClientFooter from '../../common/ClientFooter/ClientFooter';
import PageContainer from '../../common/PageContainer/PageContainer';
import WebView from './WebView';
import MobileView from './MobileView';
import {ImageIcons, Button} from 'jd-library';

const OrderFailure = props => {
    return (
        <>
            <ClientHeader />
            <PageContainer className={styles['order-failure']}>
                <div className={styles['img-container']}>
                    <img 
                        src={ImageIcons.PAYMENT_PENDING} 
                        className={styles['failed-img']}
                    />
                </div>
                <div className={styles['payment-title']}>
                    Payment Failed!
                </div>
                <div className={styles['payment-text']}>
                    The payment could not be successfully completed. Please try after some time.
                </div>
                <Button
                    className={styles['home-btn']}
                    size='lg'
                >
                    GO TO HOMEPAGE
                </Button>
            </PageContainer>
            <ClientFooter />
        </>
    );
};

const mapStateToProps = ({cart, deviceData}, props) => {
    const items = cart.items;
    const totalPrice = items.reduce((sum, item) => {
        return sum + Number(item.price);
    }, 0);

    return {
        ...props,
        totalPrice,
        isMobile: deviceData.isMobile
    }
};

export default connect(mapStateToProps)(OrderFailure);