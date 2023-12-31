import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from '../../styles/CommentCreateEditForm.module.css';
import btnStyles from '../../styles/Button.module.css';

function CommentEditForm(props) {
    const { id, text, setShowEditForm, setComments } = props;
    const [formContent, setFormContent] = useState(text);

    /*
       Handles changes to input field
    */
    const handleChange = (event) => {
        setFormContent(event.target.value);
    };

    /*
        Handles form submission 
    */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put(`/comments/${id}`, {
                text: formContent.trim(),
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.map((comment) => {
                    return comment.id === id
                        ? {
                            ...comment,
                            text: formContent.trim(),
                            updated_on: "now",
                        }
                        : comment;
                }),
            }));
            setShowEditForm(false);
        } catch (err) {
            // console.log(err);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="pr-1">
                <Form.Label className="d-none" htmlFor="editComment">Comment</Form.Label>
                <Form.Control
                    id="editComment"
                    className={styles.Form}
                    as="textarea"
                    value={formContent}
                    onChange={handleChange}
                    rows={2}
                />
            </Form.Group>
            <div className="text-right">
                <button
                    className={`${btnStyles.Button} ${btnStyles.Orange}`}
                    onClick={() => setShowEditForm(false)}
                    type="button"
                >
                    cancel
                </button>
                <button
                    className={`${btnStyles.Button} ${btnStyles.Orange}`}
                    disabled={!text.trim()}
                    type="submit"
                >
                    save
                </button>
            </div>
        </Form>
    );
}

export default CommentEditForm;