import React, { useState, useEffect } from 'react';
import { Form } from "jd-library";
//import { InputWithSection } from "jd-library"
import { Button } from "jd-library";
import { connect } from 'react-redux';
import { blockDay } from '../../actions/page.js';
import { addRate } from '../../actions/page.js';
import { checkAvailability } from '../../actions/page.js';
import { addBooking } from '../../actions/page.js';
import Dropdown from '../../../client/common/Attributes/Dropdown.jsx';
import styles from './calendar.scss';

const FormContainer = props => {

    console.log(props);
    console.log(props.resarr);
    const [flag, setFlag] = useState(false);
    const [service, setService] = useState(props.timeSlotUnit !== "DAY" ? (props.resarr.length > 0 ? props.resarr[0].id : null) : null);
    const [person, setPerson] = useState(props.timeSlotUnit !== "DAY" ? (props.personarr.length > 0 ? props.personarr[0].id : null) : null)
    useEffect(() => {
        console.log("In use Effect");
        console.log(service);
        console.log(person);
    }, []);

    const [form, setForm] = useState(() => {
        const objBooking = [
            {
                title: "Start Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "startDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.startStr.substring(0, 19) : props.formData.startStr
                //disabled: "true"
            },
            props.allowToDate == 1 ? {
                title: "End Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "endDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.endStr.substring(0, 19) : props.formData.endStr
                //disabled: "true"
            } : null,
            {
                title: "Location",
                type: "text",
                name: "location",
                value: props.location,
                disabled: "true"
            },
            props.timeSlotUnit === "DAY" ? {
                title: "Room",
                type: "text",
                name: "room",
                value: props.formData.resource.title,
                disabled: "true"
            } : null, ...(props.searchForm || []), ...(props.pageData.resourceList || [])
        ];

        const objRate = [
            {
                title: "Start Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "startDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.startStr.substring(0, 19) : props.formData.startStr
                //disabled: "true"
            },
            {
                title: "End Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "endDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.endStr.substring(0, 19) : props.formData.endStr
                //disabled: "true"
            },
            {
                title: "Location",
                type: "text",
                name: "location",
                value: props.location,
                disabled: "true"
            },
            props.timeSlotUnit === "DAY" ? {
                title: "Room",
                type: "text",
                name: "room",
                value: props.formData.resource.title,
                disabled: "true"
            } : {
                    title: props.formData.resource.extendedProps.dependantOn.length > 0 ? "Person" : "Service",
                    type: "text",
                    name: "room",
                    value: props.formData.resource.title,
                    disabled: "true"
                },
            {
                title: "Rate",
                type: "text",
                name: "rate",
                value: props.rate
            }
        ];

        const objBlocked = [
            {
                title: "Start Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "startDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.startStr.substring(0, 19) : props.formData.startStr
                //         disabled: "true"
            },
            {
                title: "End Date",
                type: props.calendarTimeType === "DATETIME" ? "datetime-local" : "date",
                name: "endDate",
                value: props.calendarTimeType === "DATETIME" ? props.formData.endStr.substring(0, 19) : props.formData.endStr
                // disabled: "true"
            },
            {
                title: "Location",
                type: "text",
                name: "location",
                value: props.location,
                disabled: "true"
            },
            props.timeSlotUnit === "DAY" ? {
                title: "Room",
                type: "text",
                name: "room",
                value: props.formData.resource.title,
                disabled: "true"
            } : {
                    title: props.formData.resource.extendedProps.dependantOn.length > 0 ? "Person" : "Service",
                    type: "text",
                    name: "room",
                    value: props.formData.resource.title,
                    disabled: "true"
                }];

        const btnBooked = [{
            id: 1,
            text: 'Book',
            variant: 'danger'
        }];

        const btnRate = [{
            id: 2,
            text: 'Add Rate',
            variant: 'danger'
        }];

        const btnBlock = [{
            id: 3,
            text: 'Block',
            variant: 'danger'
        }]

        switch (props.formType) {
            case 'Add Booking':
                return { type: objBooking, btn: btnBooked };
            case 'Add Rate':
                return { type: objRate, btn: btnRate };
            case 'Blocked':
                return { type: objBlocked, btn: btnBlock };
            default:
                return { type: objBooking, btn: btnBooked };
        }
    });

    const handleChange = (e, i) => {
        const value = e.target.value;
        setFlag(true);
        setForm(form => {
            const newForm = { type: [...form.type], btn: [...form.btn] };
            newForm.type[i].value = value;
            props.formType === "Add Booking" && props.checkAvailability(props.selectedLoc, props.resources, props.formData, newForm, props.pageData.resourceList);
            return newForm;
        })
    }

    const onBtnClick = () => {
        switch (props.formType) {
            case 'Add Booking':
                props.addBooking(props.pageData.data, props.formData, props.resources, props.selectedLoc, form, props.allowToDate, props.timeSlotUnit, person, service);
                props.toggleModal(false);
                break;
            case "Blocked":
                props.blockDay(props.pageData.data, props.formData, props.resources, props.selectedLoc, props.timeSlotUnit, form, props.pageData);
                props.toggleModal(false);
                break;
            case 'Add Rate':
                props.addRate(props.pageData.data, props.formData, props.resources, props.selectedLoc, form, props.allowToDate, props.timeSlotUnit);
                props.toggleModal(false);
                break;
        }
    }

    const handleServiceChange = (service) => {
        console.log(service);
        setService(parseInt(service));

    }

    const handlePersonChange = (person) => {
        console.log(person);
        setPerson(parseInt(person));
    }

    console.log(props.selectedLoc);
    return (
        <>
            <Form>
                {form.type.map((o, i) => (
                    o != null ?
                        <Form.Group>
                            <Form.Label>{o.title}</Form.Label>
                            <Form.Control
                                type={o.type}
                                value={o.value}
                                onChange={e => handleChange(e, i)}
                                disabled={o.disabled}
                            />
                        </Form.Group> : null
                ))
                }
                {props.timeSlotUnit !== "DAY" && props.formType === "Add Booking" && <>
                    {props.resarr.length > 0 ? <Form.Group
                        className={styles['resource-dropdown']}>
                        <Form.Label>
                            Service
                    </Form.Label>
                        <Dropdown
                            values={props.resarr}
                            onChange={(attrId, value) => handleServiceChange(value[0])}
                            value={[service]}
                        />
                    </Form.Group> : null}
                    {props.personarr.length > 0 ? <Form.Group
                        className={styles['resource-dropdown']}>
                        <Form.Label>
                            Person
                    </Form.Label>
                        <Dropdown
                            values={props.personarr}
                            onChange={(attrId, value) => handlePersonChange(value[0])}
                            value={[person]}
                        />
                    </Form.Group> : null} </>}
                {props.formType === "Add Booking" ? flag ? <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        value={props.price}
                        disabled="true"
                    />
                </Form.Group> : <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            value={props.rate}
                            disabled="true"
                        />
                    </Form.Group> : null}
            </Form >
            {form.btn.map(btn => (
                props.count == 0 ? <Button
                    variant={btn.variant}
                    clickHandler={onBtnClick}
                    disabled
                >
                    {btn.text}
                </Button> : <Button
                    variant={btn.variant}
                    clickHandler={onBtnClick}
                >
                        {btn.text}
                    </Button>)
            )
            }
        </>
    )

}

const mapStateToProps = (state, props) => ({
    ...props,
    pageData: state.page.data
})

export default connect(mapStateToProps, {
    blockDay,
    addRate,
    checkAvailability,
    addBooking
})(FormContainer);
