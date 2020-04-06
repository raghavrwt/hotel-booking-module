import React, { useRef } from 'react';
import styles from './booking-slider.scss';
import { connect } from 'react-redux';
import { SliderWrapper } from 'jd-library';
import {
    hideBookingModal
} from '../../actions/booking';
import BookingForm from '../BookingForm/BookingForm';

const BookingSlider = (props, ref) => {
    const formRef = useRef(null)

    if (!props.showBooking) {
        return null;
    }

    const onBook = () => {
        props.hideBookingModal();
    }

    console.log(formRef);

    return (
        <SliderWrapper
            header={{
                heading: 'Booking',
                rightIcons: [
                    {
                        className: 'icon-closeLight',
                        onClick: e => props.hideBookingModal()
                    }
                ],
                leftIcons: []
            }}
            onHidden={show => {
                props.hideBookingModal()
            }}
            isMobile={props.isMobile}
            footer={{
                btnProps: [{
                    children: 'Book Now',
                    clickHandler: () => formRef.current.onBook()
                }]
            }}
        >
            <BookingForm
                className={styles['slider-form']}
                ref={formRef}
                onBook={onBook}
                renderBtn={false}
            />
        </SliderWrapper>
    )
}

const mapStateToProps = ({ booking, deviceData }, props) => {
    const selectedResource = booking.selectedResource;

    return {
        ...props,
        showBooking: booking.showBooking,
        modalTitle: `${selectedResource.name}(Rs.${booking.price})`,
        isMobile: deviceData.isMobile
    };
};

export default connect(mapStateToProps, { hideBookingModal })(BookingSlider);