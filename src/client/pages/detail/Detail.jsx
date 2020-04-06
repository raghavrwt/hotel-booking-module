import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './detail.scss';
import ClientHeader from '../../common/ClientHeader/ClientHeader';
import ClientFooter from '../../common/ClientFooter/ClientFooter';
import PageContainer from '../../common/PageContainer/PageContainer';
import WebView from './web/WebView';
import MobileView from './mobile/MobileView';

const Detail = props => {
    const history = useHistory();

    const onBook = useCallback(() => {
        history.push('/cart');
    }, []);

    const Component = props.isMobile ? MobileView : WebView;

    return (
        <>
            <ClientHeader />
            <PageContainer className={styles['detail-container']}>
                <Component
                    data={props.data}
                    price={props.price}
                    onBook={onBook}
                />
            </PageContainer>
            <ClientFooter />
        </>
    );
}

const mapStateToProps = ({ detail, booking, deviceData }, props) => ({
    ...props,
    data: detail.data,
    price: booking.price,
    isMobile: deviceData.isMobile
});

export default connect(mapStateToProps)(Detail);