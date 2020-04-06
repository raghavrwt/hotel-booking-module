import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'jd-library';
import FullCalendar from '@fullcalendar/react';
//import timeGridPlugin from '@fullcalendar/timegrid';
//import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
//import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import momentPlugin from '@fullcalendar/moment'
//import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interaction from '@fullcalendar/interaction';
import Dropdown from '../../../client/common/Attributes/Dropdown.jsx'
import Popup from "reactjs-popup";
// import { deleteBlockDay } from '../../actions/page.js';
import { rateCalendarLocationChange } from '../../actions/page.js'
import { resetRateCalendarRate } from '../../actions/page.js';
// import { addBookingData } from '../../actions/page.js';
// import { resetBooking } from '../../actions/page.js';
// import './main.scss';
// import './modal.scss';
// import './popup.scss';
import styles from '../calendarpage/calendar.scss';
import RateCalendarModal from './RateCalendarModal.jsx';

class RateCalendarPage extends React.Component {

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
            call: false,
            startDay: ''
        }
    }

    componentDidMount = () => {
        console.log("In component Did mount");
        this.props.pageData.data.location.map((loc) => {
            var filterArray = [];
            console.log(this.state.selected);
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
                //console.log(this.state.resources);
                console.log(this.state.showResources);
            });
        })
    }

    handleLocationChange = (locationId) => {
        this.setState({ selected: parseInt(locationId) }, () => {
            this.props.rateCalendarLocationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates, this.state.startDay);
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
            this.props.rateCalendarLocationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates, this.state.startDay);
        });
    }


    datesRender = (info) => {
        console.log("In Dates Render")
        console.log(info);
        var startDate = info.view.activeStart;
        var stDate = (new Date(startDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19).replace('T', ' ')
        console.log(stDate);
        var startDay = new Date(stDate).getDay();
        console.log(startDay);
        var endDate = info.view.activeEnd;
        var enDate = (new Date(endDate - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1).substring(0, 19).replace('T', ' ')
        console.log(enDate);
        if (this.state.startDateTime != stDate || this.state.endDateTime != enDate) {
            this.setState({ startDateTime: stDate, endDateTime: enDate, startDay: startDay }, () => {
                this.props.rateCalendarLocationChange(this.props.pageData.data, this.state.showResources, this.state.selected, this.state.selectedRes, this.state.startDateTime, this.state.endDateTime, this.props.pageData.data.timeSlotUnit, this.props.pageData.data.globalRates, this.state.startDay);
            });
        }
    }

    handleSelect = (info) => {
        console.log("In handle Select")
        console.log(info);
        //console.log(this.state.isSelected)
        this.setState({ eventClick: false })
        //console.log(info);
        this.setState({ info: info });
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
        this.toggleTooltip(true);

        // this.getRate(info);
    }

    toggleTooltip = (open) => {
        this.setState({ open: open });
    }

    addRate = () => {
        this.setState({ show: true });
        this.setState({ formType: "Add Rate" });
        this.setState({ open: false })
    }

    onToggleCB = (action) => {
        console.log(action);
        if (action === 'hide') {
            this.setState({
                show: false
            })
        }
    }

    toggleModal = (show) => {
        this.setState({ show });
    }


    resetRate = () => {
        console.log("Reset");
        this.props.resetRateCalendarRate(this.state.blockRates, this.props.pageData.rates, this.state.selected, this.state.startDateTime, this.state.endDateTime, this.props.pageData.globalRates);
        console.log(this.state.open);
        if (this.state.open == true) {
            this.toggleTooltip(false)
        }
    }

    selectOverlap = (event) => {

        if (event.backgroundColor === '#3399ff') {
            this.setState({ eventClick: true })
            this.setState({ blockRates: event });
            console.log(this.state.blockRates);
            if (this.state.open == true) {
                this.toggleTooltip(false)
            }
            //this.setState({ blockEvents: event });
            //console.log(this.state.blockEvents);
            this.toggleTooltip(true);
        }

        return !(event.backgroundColor === '#3399ff');
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

    eventRender = (info) => {
        //console.log("Event Render");
        //console.log(info);
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

    render() {
        console.log(this.props.pageData);
        return (
            <div className={styles['calendar-container']}
            >
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

                </div>
                <div id="calendar" style={{ float: "left", marginTop: "20px" }}>
                    {this.props.pageData.data.timeSlotUnit === "DAY" ? <FullCalendar
                        plugins={[interaction, resourceTimelinePlugin, momentPlugin]}
                        selectable={true}
                        defaultView='customWeek'
                        header={false}
                        datesRender={this.datesRender}
                        events={this.props.pageData.rates}
                        //datesRender={this.datesRender}
                        eventRender={this.eventRender}
                        //dateClick={this.dayClick}
                        //selectOverlap={this.selectOverlap}
                        views={{
                            customWeek: {
                                type: 'resourceTimelineWeek',
                                duration: { days: 7 },
                                slotDuration: { days: 1 },
                                slotLabelFormat: { weekday: 'long' }
                            }
                        }}
                        // firstDay={5}
                        select={this.handleSelect}
                        //eventClick={this.handleEventClick}
                        resources={this.state.showResources}
                        defaultDate={new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + (new Date().getDay() === 0 ? -6 : 1)))}
                    />
                        : <FullCalendar
                            plugins={[interaction, resourceTimelinePlugin, momentPlugin]}
                            selectable={true}
                            defaultView='customWeek'
                            header={{
                                left: 'prev next',
                                center: 'title',
                                right: ''
                            }}
                            events={this.props.pageData.rates}
                            datesRender={this.datesRender}
                            eventRender={this.eventRender}
                            //dateClick={this.dayClick}
                            selectOverlap={this.selectOverlap}
                            views={{
                                customWeek: {
                                    type: 'resourceTimelineWeek',
                                    duration: { days: 1 },
                                    titleFormat: { weekday: 'long' }
                                }
                            }}
                            // columnHeader={false}
                            select={this.handleSelect}
                            eventClick={this.handleEventClick}
                            resources={this.state.showResources}
                            defaultDate={new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + (new Date().getDay() === 0 ? -6 : 1)))}
                        />}

                    <RateCalendarModal
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
                        globalStartDateTime={this.state.startDateTime}
                        globalEndDateTime={this.state.endDateTime}
                    />


                    <Popup
                        open={this.state.open}
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{
                            padding: "10px", border: "none", width: "auto"
                        }}
                        arrow={false}>
                        <div className="men">
                            {this.state.eventClick ? null : <div className="men-item" onClick={this.addRate}>Add Rate</div>}
                            {this.state.eventClick ? <div className="men-item" onClick={this.resetRate}>Reset Quick Rates</div> : null}
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
    rateCalendarLocationChange,
    resetRateCalendarRate
})(RateCalendarPage);
