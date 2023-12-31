import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignUpLogInForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import LogInImage from "../../assets/LogInImage.png"
import {
    Form,
    Button,
    Image,
    Col,
    Row,
    Container,
    Alert
} from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/Utils";


/* 
    Handles submit of login form
*/
function LogInForm() {
    const setCurrentUser = useSetCurrentUser();
    useRedirect('loggedIn')

    const [logInData, setLogInData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = logInData;

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const handleChange = (e) => {
        setLogInData({
            ...logInData,
            [e.target.name]: e.target.value
        });
    }

    /*
        Handle changes to input fields
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/dj-rest-auth/login/', logInData);
            setCurrentUser(data.user);
            setTokenTimestamp(data);
            history.goBack();
        } catch (err) {
            setErrors(err.response?.data);
        }
    }

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>Log In</h1>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                            {errors.username?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                            {errors.password?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                        </Form.Group>
                        <Button
                            type="submit"
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Orange}`}
                        >
                            Log In!
                        </Button>
                        {errors.non_field_errors?.map((message, idx) => (
                            <Alert variant="warning" key={idx} className="mt-3">
                                {message}
                            </Alert>
                        ))}
                    </Form>

                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/signup">
                        Don't have an account? Sign up now!
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
            >
                <Image
                    className={`${appStyles.FormImage}`}
                    src={LogInImage}
                    alt="Welcome! Log in and express yourself!"
                />
            </Col>
        </Row>
    );
}

export default LogInForm;