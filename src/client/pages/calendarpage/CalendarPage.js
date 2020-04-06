import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'jd-library';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interaction from '@fullcalendar/interaction';
import Dropdown from '../../../client/common/Attributes/Dropdown.jsx'
import Popup from "reactjs-popup";
import { deleteBlockDay } from '../../actions/page.js';
import { locationChange } from '../../actions/page.js'
import { resetRate } from '../../actions/page.js';
import { addBookingData } from '../../actions/page.js';
import { resetBooking } from '../../actions/page.js';
import './main.scss';
import './modal.scss';
import './popup.scss';
import styles from './calendar.scss'
import CalendarModal from './CalendarModal.jsx';

class CalendarPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resources: [],
            selected: this.props.pageData.data.location[0].id,
            showResources: [],
            show: false,
            open: false,
            openBlock: false,
            info: [],
            eventClick: false,
            location: this.props.pageData.data.location[0].name,
            selectedRes: -1,
            formType: "",
            blockEvents: [],
            blockRates: [],
            rate: '',
            isSelected: false,
            checkRate: true,
            startDateTime: '',
            endDateTime: '',
            call: false
        }
    }

    componentDidMount = () => {
        this.props.pageData.data.location.map((loc) => {
            var filterArray = [];
            var allArray = [];
            filterArray = this.props.pageData.data.resource.filter((resource) => {
                if (resource.partOf !== null) {
                    return resource.partOf.indexOf(parseInt(this.state.selected)) > -1
                }
            })
            allArray = this.props.pageData.data.resource.filter((resource) => {
                if (resource.partOf !== null) {
                    return resource.partOf.indexOf(parseInt(this.state.selected)) > -1
                }
            })
            allArray.unshift(this.props.pageData.data.resource[0]);
            this.setState({ resources: allArray, showResources: filterArray }, () => {
                console.log(this.state.resources);
            });
        })
    }

    selectOverlap = (event) => {
        if (event.backgroundColor === '#333333') {
            if (this.state.openBlock == true) {
                this.toggleTooltipBlock(false)
            }
            this.setState({ blockEvents: event });
            this.toggleTooltipBlock(true);
        }
        if (event.backgroundColor === '#3399ff') {
            this.setState({ eventClick: true })
            this.setState({ blockRates: event });
            if (this.state.open == true) {
                this.toggleTooltip(false)
            }
            this.toggleTooltip(true);
        }
        if (event.backgroundColor === '#009900') {
            this.setState({ eventClick: true })
            if (this.state.open == true) {
                this.toggleTooltip(false)
            }
            this.toggleTooltip(true);
        }
        return !(event.backgroundColor === '#333333' || event.backgroundColor === '#009900' || event.backgroundColor === '#3399ff');
    }

    handleSelect = (info) => {
        this.setState({ eventClick: false })
        this.setState({ info: info });
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
        this.toggleTooltip(true);
        if (this.props.pageData.data.timeSlotUnit !== "DAY") {
            this.getService(info);
        };
        if (this.props.pageData.data.timeSlotUnit !== "DAY") {
            this.getPeople(info);
        };
        this.getRate(info);
    }

    getRate = (info) => {
        this.props.pageData.rates.map(rate => {
            var rateStartDate = new Date(rate.start);
            var infoStartDate = new Date(info.startStr);
            var rateEndDate = new Date(rate.end);
            var infoEndDate = new Date(info.endStr)
            if ((rate.resourceIds[1] == parseInt(info.resource.id)) && (rateStartDate >= infoStartDate) && (rateEndDate <= infoEndDate)) {
                this.setState({ rate: rate.title }, () => {
                    console.log(this.state.rate)
                })
            }
        })
    }

    getService = (info) => {
        var resarr = [];
        this.props.pageData.data.resource.map((res) => {
            if (info.resource.id == res.id) {
                if (info.resource.extendedProps.dependantOn.length == 0) {
                    info.resource.extendedProps.partOf.map(loc => {
                        if (loc === parseInt(this.state.selected)) {
                            resarr.push(res);
                        }
                    })

                }

                else {
                    this.props.pageData.data.resource.map((reso) => {
                        info.resource.extendedProps.dependantOn.map((did) => {
                            if (did === reso.id) {
                                reso.partOf.map(loc => {
                                    if (loc === parseInt(this.state.selected)) {
                                        resarr.push(reso);
                                    }
                                })
                            }
                        })
                    })
                }
            }
            this.setState({ resarr: resarr }, () => {
                console.log(this.state.resarr);
            });
        })


    }

    getPeople = (info) => {
        var personarr = [];
        this.props.pageData.data.resource.map((res) => {
            if (info.resource.id == res.id) {
                if (info.resource.extendedProps.dependantOn.length == 0) {

                    this.props.pageData.data.resource.map((reso) => {
                        if (reso.dependantOn == null) {
                            /* Empty block */
                        }
                        else {
                            if (reso.dependantOn.indexOf(parseInt(info.resource.id)) > -1) {
                                reso.partOf.map(loc => {
                                    if (loc === parseInt(this.state.selected)) {
                                        personarr.push(reso);
                                    }
                                })

                            }
                        }

                    })
                }

                else {
                    personarr.push(res);
                }
            }
            this.setState({ personarr: personarr }, () => {
                console.log(personarr);
            });
        })
    }

    handleLocationChange = (locationId) => {
        this.setState({ selected: parseInt(locationId) }, () => {
            this.props.locationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates);
            this.props.pageData.data.location.map((loc) => {
                var filterArray = [];
                var allArray = [];
                filterArray = this.props.pageData.data.resource.filter((resource) => {
                    if (resource.partOf !== null) {
                        return resource.partOf.indexOf(this.state.selected) > -1
                    }
                })
                allArray = this.props.pageData.data.resource.filter((resource) => {
                    if (resource.partOf !== null) {
                        return resource.partOf.indexOf(parseInt(this.state.selected)) > -1
                    }
                })
                allArray.unshift(this.props.pageData.data.resource[0]);
                this.setState({
                    resources: allArray, showResources:
                        filterArray
                })
            })

            this.props.pageData.data.location.map(loc => {
                if (loc.id === this.state.selected) {
                    this.setState({ location: loc.title });
                }
            })
            console.log(this.props.pageData.rates);
        })

    }

    handleResourceChange = (resourceId) => {
        var newArray = [];
        this.setState({ selectedRes: resourceId }, () => {
            if (this.state.selectedRes == -1) {
                var customArray = [];
                customArray = this.state.resources.filter((custom) => {
                    return custom.id > -1
                });
                this.setState({ showResources: customArray });
            }
            else {
                newArray = this.state.resources.filter((resource) => {
                    return resource.id == this.state.selectedRes;
                })
                this.setState({ showResources: newArray });
            }
            this.props.locationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates);
        });
    }

    toggleModal = (show) => {
        this.setState({ show });
    }

    toggleTooltip = (open) => {
        this.setState({ open: open });
    }

    toggleTooltipBlock = (openBlock) => {
        this.setState({ openBlock: openBlock });
    }

    addBooking = () => {
        this.props.addBookingData(this.props.pageData.data, this.state.info, this.state.showResources, this.state.selected, this.props.pageData.data.allowToDate);
        this.setState({ formType: "Add Booking" });//
        this.setState({ show: true });
        this.setState({ open: false })
    }

    addRate = () => {
        this.setState({ show: true });
        this.setState({ formType: "Add Rate" });
        this.setState({ open: false })
    }

    blockDay = () => {
        this.setState({ show: true });
        this.toggleModal(true);
        this.setState({ formType: "Blocked" });
        this.setState({ open: false })
    }

    resetRate = () => {
        console.log("Reset");
        this.props.resetRate(this.state.blockRates, this.props.pageData.rates, this.state.selected, this.state.startDateTime, this.state.endDateTime, this.props.pageData.globalRates);
        console.log(this.state.open);
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
    }

    resetBooking = () => {
        console.log("Reset Booking");
        this.props.resetBooking(this.state.eventInfo, this.props.pageData.bookings, this.state.selected, this.state.startDateTime, this.state.endDateTime);
        console.log(this.state.open);
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
    }

    unblockDay = () => {
        console.log("In Unblock");
        this.props.deleteBlockDay(this.state.blockEvents, this.props.pageData.blockedDates, this.state.selected);
        this.setState({ openBlock: false })
    }

    handleCheckBox = (e) => {
        if (this.state.isSelected == true) {
            this.toggleCheckBox(false)
        }
        else {
            this.toggleCheckBox(true);
        }
    }

    toggleCheckBox = (isSelected) => {
        this.setState({ isSelected: isSelected });
    }

    handleEventClick = (info) => {
        console.log("Handle Event Click");
        console.log(info);
        this.setState({ eventClick: true })
        this.setState({ eventInfo: info.event })
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
        this.toggleTooltip(true);
    }

    datesRender = (info) => {

        console.log("In Dates Render")
        console.log(info);
        var startDate = info.view.activeStart;
        var stDate = (new Date(startDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19).replace('T', ' ')
        console.log(stDate);
        var endDate = info.view.activeEnd;
        var enDate = (new Date(endDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19).replace('T', ' ')
        console.log(enDate);
        if (this.state.startDateTime != stDate || this.state.endDateTime != enDate) {
            this.setState({ startDateTime: stDate, endDateTime: enDate }, () => {
                this.props.locationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates);
            });
        }
        // if (this.state.startDateTime != startDateTime || this.state.endDateTime != endDateTime) {
        //     this.setState({ startDateTime: startDateTime, endDateTime: endDateTime }, () => {
        //         console.log(this.state.startDateTime);
        //         console.log(this.state.endDateTime);
        //         this.props.locationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime);
        //     })
        // }
    }


    onToggleCB = (action) => {
        console.log(action);
        if (action === 'hide') {
            this.setState({
                show: false
            })
        }
    }

    eventRender = (info) => {
        console.log("Event Render");
        console.log(info);
        if (info.event.backgroundColor === "#b3e6ff") {
            info.el.innerText = info.event.title;
            info.el.style.textAlign = "center";
            info.el.style.color = "black";
            info.el.style.fontWeight = "200";
        }
        if (info.event.backgroundColor === "#3399ff") {
            info.el.innerText = info.event.title;
            info.el.style.textAlign = "center";
            info.el.style.color = "black";
            info.el.style.fontWeight = "1000";
        }
    }

    dayClick = (info) => {
        console.log("In Day Click");
        console.log(info);

    }

    getEvents = () => {
        let eventArr = [];
        //console.log(this.state.selected);
        if (this.state.isSelected) {
            if (this.props.pageData.rates) {
                return this.props.pageData.rates;
            }
            else {
                return [];
            }
        }
        else {
            if (this.props.pageData.bookings) {
                eventArr = eventArr.concat(...this.props.pageData.bookings)
            }
            if (this.props.pageData.blockedDates) {
                eventArr = eventArr.concat(...this.props.pageData.blockedDates);
            }
            console.log(eventArr);
            return eventArr;
        }
    }

    render() {
        console.log(this.props.pageData);
        const header = {
            left: 'prev next, myCustomButton',
            center: 'title',
            right: ''
        }

        return (
            <div className={styles['calendar-container']}>
                <div>
                    <h1>{this.props.pageData.data.calendarName}</h1>
                </div>
                <div className={styles['dropdown-container']}>
                    <Form.Group
                        className={styles['location-dropdown']}>
                        <Form.Label>
                            Location
                    </Form.Label>
                        <Dropdown
                            values={this.props.pageData.data.location}
                            dayClick onChange={(attrId, value) => this.handleLocationChange(value[0])}
                            value={[this.state.selected]}
                        />
                    </Form.Group>
                    <Form.Group
                        className={styles['resource-dropdown']}>
                        <Form.Label>
                            Resource
                    </Form.Label>
                        <Dropdown
                            values={this.state.resources}
                            onChange={(attrId, value) => this.handleResourceChange(value[0])}
                            value={[this.state.selectedRes]}
                            dayClick />
                    </Form.Group>
                    <Form.Check rippleColor='rgba(33, 37, 41, .1)'
                        onChange={this.handleCheckBox}
                        className={styles['input-row']}
                        labelClass='label-row'
                        label="Show Rates"
                        checked={this.state.isSelected}
                    />
                </div>

                <div id="calendar" style={{ float: "left", marginTop: "20px" }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "12px" }} className="reserved-tooltip-on-hover">
                            <div class="reserved-tooltip">Booked</div>
                            <div style={{ width: "10px", height: "10px", backgroundColor: "#A6E0A4", borderRadius: "50px" }}></div>
                        </div>
                        <div style={{ width: "12px" }} className="blocked-tooltip-on-hover">
                            <div class="blocked-tooltip">Blocked</div>
                            <div style={{ width: "10px", height: "10px", backgroundColor: "#CFD6E0", borderRadius: "50px" }}></div>
                        </div>
                        <div style={{ width: "12px" }} className="weekend-tooltip-on-hover">
                            <div class="weekend-tooltip">Weekend</div>
                            <div style={{ width: "10px", height: "10px", backgroundColor: "#F6F8F9", borderRadius: "50px", border: "1px solid #d8dfe5" }}></div>
                        </div>
                    </div>
                    <br></br>

                    {this.props.pageData.data.timeSlotUnit === "DAY" ? <FullCalendar
                        plugins={[interaction, resourceTimelinePlugin, timeGridPlugin]}
                        selectable={true}
                        defaultView='customWeek'
                        ref={this.calendarComponentRef}
                        header={header}
                        events={this.getEvents()}
                        datesRender={this.datesRender}
                        eventRender={this.eventRender}
                        //dateClick={this.dayClick}
                        selectOverlap={this.selectOverlap}
                        views={{
                            customWeek: {
                                type: 'resourceTimeline',
                                duration: { days: 7 },
                                slotDuration: { days: 1 }
                            }
                        }}
                        select={this.handleSelect}
                        eventClick={this.handleEventClick}
                        resources={this.state.showResources}
                        defaultDate={((Date.now() / 1000) - (48 * 60 * 60)) * 1000}
                    />
                        :
                        <FullCalendar
                            plugins={[interaction, resourceTimelinePlugin, timeGridPlugin]}
                            selectable='true'
                            defaultView='customWeek'
                            views={{
                                customWeek: {
                                    type: 'resourceTimelineDay',
                                    duration: { days: 1 },
                                }
                            }}
                            header={header}
                            events={this.getEvents()}
                            datesRender={this.datesRender}
                            eventRender={this.eventRender}
                            eventClick={this.handleEventClick}
                            selectOverlap={this.selectOverlap}
                            slotDuration={this.props.pageData.data.timeSlotUnit === "MINUTE" ? "00:" + this.props.pageData.data.baseTimeSlot + ":00" : this.props.pageData.data.baseTimeSlot + ":00:00"}
                            select={this.handleSelect}
                            resources={this.state.showResources}

                        />
                    }

                    {this.state.formType === "Add Booking" ? this.props.pageData.searchForm && <CalendarModal
                        onToggleCB={this.onToggleCB}
                        show={this.state.show}
                        toggleModal={this.toggleModal}
                        formType={this.state.formType}
                        formData={this.state.info}
                        location={this.state.location}
                        resources={this.state.showResources}
                        selectedLoc={this.state.selected}
                        rate={this.state.rate}
                        allowToDate={this.props.pageData.data.allowToDate}
                        searchForm={this.props.pageData.searchForm}
                        price={this.props.pageData.price}
                        count={this.props.pageData.count}
                        timeSlotUnit={this.props.pageData.data.timeSlotUnit}
                        calendarTimeType={this.props.pageData.data.calendarTimeType}
                        personarr={this.state.personarr}
                        resarr={this.state.resarr}
                    />
                        : <CalendarModal
                            onToggleCB={this.onToggleCB}
                            show={this.state.show}
                            toggleModal={this.toggleModal}
                            formType={this.state.formType}
                            formData={this.state.info}
                            location={this.state.location}
                            resources={this.state.showResources}
                            selectedLoc={this.state.selected}
                            rate={this.state.rate}
                            allowToDate={this.props.pageData.data.allowToDate}
                            timeSlotUnit={this.props.pageData.data.timeSlotUnit}
                            calendarTimeType={this.props.pageData.data.calendarTimeType}
                            personarr={this.state.personarr}
                            resarr={this.state.resarr}
                        />}

                    <Popup
                        open={this.state.open}
                        //position="bottom center"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{
                            padding: "10px", border: "none", width: "auto"
                        }}
                        arrow={false}>
                        <div className="men">
                            {this.state.isSelected ?
                                null :
                                this.state.eventClick ?
                                    null : <div className="men-item" onClick={this.addBooking}>Add Booking</div>}
                            {this.state.isSelected ? this.state.eventClick ? null : <div className="men-item" onClick={this.addRate}>Add Rate</div> : null}
                            {this.state.isSelected ? null : this.state.eventClick ? null : <div className="men-item" onClick={this.blockDay}>Block</div>}
                            {this.state.isSelected ? this.state.eventClick ? <div className="men-item" onClick={this.resetRate}>Reset Quick Rates</div> : null : this.state.eventClick ? <div className="men-item" onClick={this.resetBooking}>Delete Booking</div> : null}
                        </div>
                    </Popup>

                    <Popup
                        open={this.state.openBlock}
                        //position="bottom center"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{
                            padding: "10px", border: "none", width: "auto"
                        }}
                        arrow={false}>
                        <div className="men">
                            <div className="men-item" onClick={this.unblockDay}>Unblock</div>
                        </div>
                    </Popup>
                </div>
            </div>
        )
    }

};

const mapStateToProps = (state, props) => ({
    ...props,
    pageData: state.page.data
})

export default connect(mapStateToProps, {
    deleteBlockDay,
    locationChange,
    resetRate,
    addBookingData,
    resetBooking
})(CalendarPage);
