import React from 'react';
import { connect } from 'react-redux';
import ResourceList from './ResourceList';
import Query from './Query';
import styles from './listing.scss';
import BookingModal from '../../common/BookingModal/BookingModal';
import BookingSlider from '../../common/BookingSlider/BookingSlider';
import ClientHeader from '../../common/ClientHeader/ClientHeader';
import ClientFooter from '../../common/ClientFooter/ClientFooter';
import PageContainer from '../../common/PageContainer/PageContainer';

const Listing = props => {
    return (
        <>
            <ClientHeader />
            <PageContainer className={styles['listing-container']}>
                <Query />
                <ResourceList />
            </PageContainer>
            <ClientFooter />
            {props.isMobile ? <BookingSlider /> : <BookingModal />}
        </>
    );
}

const mapStateToProps = ({ deviceData }, props) => ({
    ...props,
    isMobile: deviceData.isMobile
});

export default connect(mapStateToProps)(Listing);