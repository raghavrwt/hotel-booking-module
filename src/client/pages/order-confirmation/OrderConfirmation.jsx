import React from 'react';
import {connect} from 'react-redux';
import styles from './order-confirmation.scss';
import ClientHeader from '../../common/ClientHeader/ClientHeader';
import ClientFooter from '../../common/ClientFooter/ClientFooter';
import PageContainer from '../../common/PageContainer/PageContainer';
import WebView from './WebView';
import MobileView from './MobileView';

const OrderConfirmation = props => {
    const Component = props.isMobile ? MobileView : WebView;

    return (
        <>
            <ClientHeader />
            <PageContainer className={styles['confirmation-container']}>
                <Component 
                    totalPrice={props.totalPrice}
                />
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

export default connect(mapStateToProps)(OrderConfirmation);