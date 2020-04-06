import React from 'react';
import {connect} from 'react-redux';

const Form = props => {
    return (
        <div>
            FORM
        </div>
    );
}

const mapStateToProps = ({booking}, props) => ({
    ...props,
    ...booking
});

export default connect(mapStateToProps)(Form);