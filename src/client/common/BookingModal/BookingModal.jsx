import React, {useRef, useEffect, useCallback} from 'react';
import {createPortal, findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import styles from './booking-modal.scss';
import {Modal} from 'jd-library';
import Form from './Form';
import BookingForm from '../BookingForm/BookingForm';
import {
    hideBookingModal
} from '../../actions/booking';

const BookingModal = props => {
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current.modal(props.showBooking ? 'show' : 'hide');
    }, [props.showBooking]);

    const onBook = useCallback(() => {
        props.hideBookingModal();
    }, []);

    return createPortal(
        <Modal 
            ref={modalRef}
            settings= {{
                // variant: 'action',
                class: styles['booking-modal']
            }}
        >
            <Modal.CloseIcon 
                clickHandler={(e) => props.hideBookingModal()}
                />
            <Modal.Header
                className={styles['booking-header']}
            >
                {props.modalTitle}
            </Modal.Header>
            <Modal.Body>
                {props.showBooking && (
                    <BookingForm 
                        className={styles['modal-form']}
                        source='modal'
                        sliderDest={findDOMNode(modalRef.current)}
                        onBook={onBook}
                    />
                )}
            </Modal.Body>
            <Modal.Footer>
                {/* <Modal.Button>Okay</Modal.Button> */}
            </Modal.Footer>
        </Modal>
    , document.getElementById('modals'));
}

const mapStateToProps = ({booking}, props) => {
    const selectedResource = booking.selectedResource;

    return {
        ...props,
        showBooking: booking.showBooking,
        modalTitle: `${selectedResource.name}(Rs.${booking.price})`
    };
};

export default connect(mapStateToProps, {hideBookingModal})(BookingModal);