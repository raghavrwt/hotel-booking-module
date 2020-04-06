import React, {useRef, useEffect} from 'react';
import {findDOMNode} from 'react-dom';
import styles from './iframe.scss';

const Iframe = (
    {
        html,
        className='',
        ...props
    }
) => {
    const fileRef = useRef(null);

    useEffect(() => {
        const iframe = findDOMNode(fileRef.current);
        const iframedoc = iframe.contentDocument || iframe.contentWindow.document;

        iframedoc.body.innerHTML = `<html><body>${html}</body></html>`;
    }, []);

    const iframeClass = `${styles['iframe-component']} ${className}`;

    return (
        <iframe 
            {...props}
            ref={fileRef}
            className={iframeClass}
        />
    )
}

export default Iframe;