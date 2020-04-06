import React from 'react';
import {connect} from 'react-redux';
import Image from './Image';
import ResourceDetails from '../ResourceDetails';
import styles from '../detail.scss';
import {FullWidthButton} from 'jd-library';
import BookingSlider from '../../../common/BookingSlider/BookingSlider';
import {showBookingModal} from '../../../actions/booking';

const MobileView = props => {
    return (
        <>
            <Image 
                images={props.data.image}
            />
            <div className={styles['name-price-container']}>
                <div className={styles['resource-name']}>
                    {props.data.name}
                </div>
                <div className={styles['price-container']}>
                    ${props.price}
                </div>
                {props.data.details.length > 1 && (
                    <ResourceDetails 
                        details={props.data.details}
                    />
                )}
            </div>
            <FullWidthButton 
                className={styles['book-btn']}
                clickHandler={() => props.showBookingModal()}
            >
                <FullWidthButton.Section
                    variant='left'
                />
                <FullWidthButton.Section variant='right' text='Book Now' />
            </FullWidthButton>
            <BookingSlider />
        </>
    );
}

const mapStateToProps = ({booking}, props) => ({
    ...props,
    selectedResource: booking.selectedResource,
    dependantIndexes: booking.dependantIndexes
});

export default connect(mapStateToProps, {showBookingModal})(MobileView);