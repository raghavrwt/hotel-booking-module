import React, {useState} from 'react';
import AppContext from './AppContext';
import {Toast} from 'jd-library';

const AppProvider = (props) => {
    const [providerState, setProviderState] = useState(() => ({
        toast: {
            message: '',
            type: '',
            isVisible: false,
            isMobile: false,
            hasNotch: false, //This will be set from device data for screens which needs to handle bottom padding for devices like iphpneX
            animationTime: 4000,
            hasUndo: false,
            hasClose: false,
            onUndoClick: () => {

            },
            onCloseClick: () => {
                setProviderState(state => {
                    return {
                        ...state,
                        toast: {
                            ...state.toast,
                            isVisible: false
                        }
                    };
                });
            },
            showToast: (data = {}) => {
                setProviderState(state => {
                    data.isVisible = true;
                    data.animationTime = (data.hasUndo || data.message.length > 30) ? 7000 : 4000;
                    data.hasUndo = data.hasUndo || false;
                    data.hasClose = data.hasClose || false;

                    return {
                        ...state,
                        toast: {
                            ...state.toast,
                            ...data
                        }
                    };
                });

                setTimeout(() => {
                    providerState.toast.hideToast();
                }, providerState.toast.animationTime);
            },
            hideToast: () => {
                setProviderState(state => {
                    return {
                        ...state,
                        toast: {
                            ...state.toast,
                            isVisible: false
                        }
                    };
                });
            }

        }
    }));

    return (
        <AppContext.Provider
            value={providerState}
        >
            {props.children}
            <Toast {...providerState.toast} />
        </AppContext.Provider>
    );
}

export default AppProvider;