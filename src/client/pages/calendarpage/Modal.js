import React, { useState } from "react";
import ModalBooking from './ModalBooking.js';
import './modal.scss'
import ModalRates from './ModalRates.js';
import ModalBlock from './ModalBlock.js';
//import data from './dayslot.json';

const Modal = ({ handleClose, show, info, location, slot, resarr, ratearr, personarr }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
    console.log(location);
    const [showBooking, setShowBooking] = useState(false);
    const [showRates, setShowRates] = useState(false);
    const [showBlock, setShowBlock] = useState(false);
    //const [modalVal, setModalVal] = useSate('');
    const addBooking = () => {
        console.log(info);
        showModal("Booking");
    }
    console.log(ratearr);

    const changeRates = () => {
        showModal("Rates");
    }

    const blockPeriod = () => {
        showModal("Block");
    }

    const showModal = (val) => {
        if (val === "Booking") {
            setShowBooking(true);
            setShowRates(false);
            setShowBlock(false);
        }
        if (val === "Rates") {
            setShowBooking(false);
            setShowRates(true);
            setShowBlock(false);
        }

        if (val === "Block") {
            setShowBooking(false);
            setShowRates(false);
            setShowBlock(true);
        }
        console.log(val)

    }

    const hideModal = () => {
        setShowBooking(false);
        setShowRates(false);
        setShowBlock(false);
    }

    return (
        <div className={showHideClassName}>
            <section className='modal-main'>
                <div style={{ padding: "10px", backgroundColor: "rgba(255,206,92,.6)", cursor: "pointer" }} onClick={addBooking}>ADD BOOKING</div>
                <div style={{ padding: "10px", backgroundColor: "rgba(252,151,92,.6)", cursor: "pointer" }} onClick={changeRates}>CHANGE RATES</div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }} onClick={blockPeriod}>BLOCK</div>
                <div style={{ padding: "10px", textAlign: "center" }}>
                    <button type="button" onClick={handleClose} style={{ cursor: "pointer" }}>Close</button>
                </div>
            </section>
            <ModalBooking show={showBooking} handleClose={hideModal} info={info} location={location} slot={slot} resarr={resarr} personarr={personarr} ></ModalBooking>
            <ModalRates show={showRates} handleClose={hideModal} info={info} location={location} slot={slot} resarr={resarr} ratearr={ratearr} personarr={personarr}></ModalRates>
            <ModalBlock show={showBlock} handleClose={hideModal} info={info} location={location} slot={slot} resarr={resarr} personarr={personarr}></ModalBlock>
        </div>


    );
};

export default Modal;