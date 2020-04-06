import React, {useRef, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {createPortal} from 'react-dom';
import { AnimateSlider, Button, SliderWrapper } from "jd-library";
import styles from './slots.scss';
import SlotsHeader from './SlotsHeader';
import DateList from './DateList';
import SlotList from './SlotList';
import axios from 'axios';
import {format, addDays} from 'date-fns';
import { displayDateTime, serverDateFormat } from '../../dateFunctions';
import {setSlotData, setSlotDate} from '../../../actions/slots';

const Slots = props => {
    const [selectedSlot, setSlot] = useState(null);
    const [slider, showHideSlider] = useState(false);
    const displaySlot = props.selectedSlot ? format(props.selectedSlot, displayDateTime) : null;

    const showSlider = async () => {
        props.setSlotData({
            cb: () => {
                showHideSlider(true);
            }
        });
    }

    const onSaveClick = () => {
        props.onSave(selectedSlot);
        showHideSlider(false);
    }

    const onDateClick = useCallback((date) => {
        props.setSlotDate(date);
        setSlot(null);
    }, []);

    const sliderHtml = slider && (
        <SliderWrapper
            header={{
                heading: 'Select Slots',
                rightIcons: [
                    {
                        className: 'icon-closeLight',
                        onClick: e => showHideSlider(false)
                    }
                ],
                leftIcons: []
            }}
            onHidden={show => {
                showHideSlider(false);
            }}
            isMobile={props.isMobile}
            footer={{
                btnProps: [{
                    children: 'Book Now',
                    clickHandler: onSaveClick
                }]
            }}
        >
            <div className={styles['slider-body']}>
                <DateList 
                    selected={props.selectedDate}
                    onClick={onDateClick}
                    dateList={props.dates}
                />
                <div className={styles['slot-title']}>
                    Select a Slot
                </div>
                <SlotList 
                    slotsList={props.slots}
                    selected={selectedSlot}
                    onClick={setSlot}
                />
            </div>
        </SliderWrapper>
    );

    return (
        <>
            {displaySlot && (
                <div className={styles['selected-slot-container']}>
                    <div className={styles['slot-title']}>
                        Selected Slot
                    </div>
                    <div className={styles['selected-slot']}>
                        {displaySlot}
                    </div>
                </div>
            )}
            <Button
                className={styles['add-slots-btn']}
                clickHandler={showSlider}
                >
                Set Slots
            </Button>
            {props.error && (
                <div className={styles['slot-error']}>Please Select Slot</div>
            )}
            {createPortal(sliderHtml, props.dest ? props.dest : document.getElementById('sliders'))}
        </>
    );
}

const mapStateToProps = ({booking, slots, deviceData}, props) => ({
    ...props,
    query: booking.query,
    resourceId: booking.resourceId,
    dates: slots.dates,
    slots: slots.slots,
    selectedDate: slots.selectedDate,
    isMobile: deviceData.isMobile
});

export default connect(mapStateToProps, {
    setSlotData,
    setSlotDate
})(Slots);