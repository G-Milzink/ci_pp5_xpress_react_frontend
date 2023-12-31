import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from '../../styles/Button.module.css';
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
    const { post, setPost, setComments, profileImage, profile_id } = props;
    const [text, setText] = useState("");

    /*
       Handle changes to input field
    */
    const handleChange = (event) => {
        setText(event.target.value);
    };

    /* 
        Handles form submission 
    */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.post("/comments/", {
                text,
                post,
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
            setPost((prevPost) => ({
                results: [
                    {
                        ...prevPost.results[0],
                        comments_count: prevPost.results[0].comments_count + 1,
                    },
                ],
            }));
            setText("");
        } catch (err) {
            // console.log(err);
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profileImage} />
                    </Link>
                    <Form.Label className="d-none" htmlFor="comment">Comment</Form.Label>
                    <Form.Control
                    id="comment"
                        className={styles.Form}
                        placeholder="my comment..."
                        as="textarea"
                        value={text}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
            </Form.Group>
            <button
                className={`${btnStyles.Button} ${btnStyles.Orange} d-block ml-auto`}
                disabled={!text.trim()}
                type="submit"
            >
                post
            </button>
        </Form>
    );
}

export default CommentCreateForm;