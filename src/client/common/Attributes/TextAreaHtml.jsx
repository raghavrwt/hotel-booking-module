import React, {useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import useTinyMCE from '../../hooks/useTinyMCE';

const TextAreaHtml = props => {
    useTinyMCE('tiny');

    const handleChange = (content, editor) => {
        props.onChange(props.attributeId, [content]);
    }

    return (
        <Editor
            id="tiny"
            init={{
                height: 500,
                menubar: false,
                branding: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
            }}
            value={props.value[0]}
            onEditorChange={handleChange}
        />
    );
}

export default TextAreaHtml;