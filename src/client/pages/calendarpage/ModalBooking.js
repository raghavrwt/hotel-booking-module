import React, { useState, useEffect } from "react";
import './modalbooking.scss';
import data from './dayslot.json';

const ModalBooking = ({ handleClose, show, info, location, slot, resarr, personarr }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return show ? slot === "DAY" ? (
        <div className={showHideClassName}>
            <section className='modal-main-booking'>
                <div style={{ padding: "10px", backgroundColor: "rgba(255,206,92,.6)", cursor: "pointer" }}>
                    <label>Start Date</label>
                    <input type="datetime-local" name="startDate" defaultValue={(new Date(info.start - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 16)} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(252,151,92,.6)", cursor: "pointer" }} >
                    <label>End Date</label>
                    <input type="datetime-local" name="endDate" defaultValue={(new Date(info.end - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 16)} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }}>
                    <label>Location</label>
                    <input type="text" name="location" defaultValue={location} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }}>
                    <label>Rooms</label>
                    <input type="text" name="room" defaultValue={info.resource.title} />
                </div>
                <div style={{ padding: "10px", textAlign: "center" }}>
                    <button type="button" onClick={handleClose} style={{ cursor: "pointer" }}>Book</button>
                </div>
            </section>
        </div>


    ) :
        <div className={showHideClassName}>
            <section className='modal-main-booking'>
                <div style={{ padding: "10px", backgroundColor: "rgba(255,206,92,.6)", cursor: "pointer" }}>
                    <label>Start Date</label>
                    <input type="datetime-local" name="startDate" defaultValue={(new Date(info.start - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 16)} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(252,151,92,.6)", cursor: "pointer" }} >
                    <label>End Date</label>
                    <input type="datetime-local" name="endDate" defaultValue={(new Date(info.end - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 16)} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }}>
                    <label>Location</label>
                    <input type="text" name="location" defaultValue={location} />
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }}>
                    <label>Service</label>
                    {/* <input type="text" name="service" defaultValue={info.resource.title} /> */}
                    <select id="person">
                        {/* <option value={info.resource.id}>{info.resource.title}</option>) */}
                        {resarr.map((d) => {
                            return (<option value={d.id}>{d.title}</option>)
                        })}
                    </select>
                </div>
                <div style={{ padding: "10px", backgroundColor: "rgba(182,193,205,.6)", cursor: "pointer" }}>
                    <label>Person</label>
                    <select id="person">
                        {personarr.map((d) => {
                            return (<option value={d.id}>{d.title}</option>)
                        })}
                    </select>
                    {/* <input type="text" name="person" defaultValue={info.resource.title} /> */}
                </div>
                <div style={{ padding: "10px", textAlign: "center" }}>
                    <button type="button" onClick={handleClose} style={{ cursor: "pointer" }}>Book</button>
                </div>
            </section>
        </div>
        : null;
};

export default ModalBooking;