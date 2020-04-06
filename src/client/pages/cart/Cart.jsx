import React from 'react';
import { connect } from 'react-redux';
import styles from './cart.scss';
import ClientHeader from '../../common/ClientHeader/ClientHeader';
import ClientFooter from '../../common/ClientFooter/ClientFooter';
import PageContainer from '../../common/PageContainer/PageContainer';
import ItemList from './ItemList';
import RightSection from './RightSection';
import WebView from './WebView';
import MobileView from './MobileView';

const Cart = props => {
    let containerClass = styles['cart-container'];

    if (props.totalItems === 0) {
        containerClass += ` ${styles['no-items']}`;
    }

    const Component = props.isMobile ? MobileView : WebView;

    return (
        <>
            <ClientHeader />
            <PageContainer className={containerClass}>
                <Component
                    totalItems={props.totalItems}
                />
            </PageContainer>
            <ClientFooter />
        </>
    );
}

const mapStateToProps = ({ cart, deviceData }, props) => ({
    ...props,
    totalItems: cart.items.length,
    isMobile: deviceData.isMobile
});

export default connect(mapStateToProps)(Cart);