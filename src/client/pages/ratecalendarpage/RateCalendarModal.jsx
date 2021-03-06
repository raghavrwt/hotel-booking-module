import React, { useEffect } from 'react';
import { Modal } from "jd-library";
import RateFormContainer from './RateFormContainer.jsx'
import './ratemodal.scss';

const RateCalendarModal = props => {
    const modalRef = React.useRef(null);

    useEffect(() => {
        modalRef.current.modal(props.show ? 'show' : 'hide');
    }, [props.show]);

    const modalSettings = {
        modalId: 'actionModal',
        variant: 'action',
        class: 'price-modal'
    }

    console.log(props.selectedLoc)
    return (
        <Modal
            ref={modalRef}
            onToggleCB={(action) => props.onToggleCB(action)}
            settings={modalSettings}
        >
            <Modal.CloseIcon
                clickHandler={() => props.toggleModal(false)}
            />
            <Modal.Header>
                {props.formType}

            </Modal.Header>
            <Modal.Body>
                {props.show ? (
                    <RateFormContainer
                        formType={props.formType}
                        formData={props.formData}
                        location={props.location}
                        resources={props.resources}
                        selectedLoc={props.selectedLoc}
                        rate={props.rate}
                        allowToDate={props.allowToDate}
                        searchForm={props.searchForm}
                        price={props.price}
                        count={props.count}
                        timeSlotUnit={props.timeSlotUnit}
                        calendarTimeType={props.calendarTimeType}
                        personarr={props.personarr}
                        resarr={props.resarr}
                        toggleModal={props.toggleModal}
                        globalStartDateTime={props.globalStartDateTime}
                        globalEndDateTime={props.globalEndDateTime}
                    />
                ) : null}
            </Modal.Body>
        </Modal>
    )
}

export default RateCalendarModal;