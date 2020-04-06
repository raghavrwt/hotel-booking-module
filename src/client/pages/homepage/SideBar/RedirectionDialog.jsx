import React, { useRef, useEffect } from 'react';
import {createPortal} from 'react-dom';
import {connect} from 'react-redux';
import {ActionDialog} from 'jd-library';
import {
    setMenu,
    showHideRedirectionDialog
} from '../../../actions/menu';

const RedirectionDialog = (props) => {
    const dialogRef = useRef(null);
    const dialog = props.dialog;

    useEffect(() => {
        dialogRef.current.modal(dialog.show ? 'show' : 'hide');
    }, [dialog]);

    const clickHandler = () => {
        props.setMenu({
            skipCheck: true,
            menuObj: dialog.redirectMenu
        });
        props.showHideRedirectionDialog({ show: false });
    }

    return createPortal(
        <ActionDialog
            ref={dialogRef}
            settings={{
                modalId: 'secondModal',
                variant: 'action'
            }}
            title={dialog.title}
            content={dialog.content}
            btnArray={[
                {
                    variant: 'primary',
                    children: dialog.btnContent,
                    clickHandler
                }
            ]}
        ></ActionDialog>
    , document.getElementById('modals'));
}

const mapStateToProps = (state, props) => ({
    ...props,
    dialog: state.menu.dialog
})

export default connect(mapStateToProps, {
    setMenu,
    showHideRedirectionDialog
})(RedirectionDialog);