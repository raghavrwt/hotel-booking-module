import React, { useState, useEffect } from 'react';
import { Form } from "jd-library";
//import { InputWithSection } from "jd-library"
import { Button } from "jd-library";
import { connect } from 'react-redux';
import { addRateCalendarRate } from '../../actions/page.js';
//import styles from './calendar.scss';

const RateFormContainer = props => {

    const [form, setForm] = useState('');

    console.log(props);
    const handleChange = (e) => {
        const value = e.target.value;
        console.log(value);
        setForm(e.target.value)
    }

    const onBtnClick = () => {
        props.addRateCalendarRate(props.pageData.data, props.formData, props.resources, props.selectedLoc, form, props.allowToDate, props.timeSlotUnit, props.globalStartDateTime, props.globalEndDateTime);
        props.toggleModal(false);
    }


    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Rate</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={e => handleChange(e)}
                    />
                </Form.Group>
            </Form >
            <Button
                variant={"danger"}
                clickHandler={onBtnClick}
            >
                {"Add Rate"}
            </Button>
        </>
    )

}

const mapStateToProps = (state, props) => ({
    ...props,
    pageData: state.page.data
})

export default connect(mapStateToProps, {
    addRateCalendarRate
})(RateFormContainer);
