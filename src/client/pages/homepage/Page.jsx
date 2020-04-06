import React from 'react';
import { connect } from 'react-redux';
import styles from './home-page.scss';
import ResourceList from './ResourceList/ResourceList';
import FormRenderer from './FormRenderer/FormRenderer';
import CalendarPage from '../calendarpage/CalendarPage.js'
import RateCalendarPage from '../ratecalendarpage/RateCalendarPage.js';
import Loader from '../../common/Loader/Loader';

const Page = (props) => {
    if (props.loading) {
        return <Loader />;
    }

    const componentMap = {
        'RESOURCELIST': ResourceList,
        'FORM': FormRenderer,
        'CALENDAR': CalendarPage,
        'RATE_CALENDAR': RateCalendarPage
    };

    const Component = componentMap[props.view] || null;

    return Component && (
        <div className={styles['page']}>
            <Component />
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    ...props,
    view: state.page.view,
    loading: state.menu.loading
});

export default connect(mapStateToProps)(Page);