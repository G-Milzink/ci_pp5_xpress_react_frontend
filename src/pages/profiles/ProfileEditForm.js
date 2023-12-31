import React, { useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const history = useHistory();
    // const imageFile = useRef();

    // State to keep track of the selected image file
    const [selectedImage, setSelectedImage] = useState(null);

    const [profileData, setProfileData] = useState({
        name: "",
        bio: "",
        avatar: "",
        owner: "",
    });
    const { name, bio, avatar, owner } = profileData;
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let isMounted = true;

        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const { name, bio, avatar, owner } = data;
                    if (isMounted) {
                        setProfileData({ name, bio, avatar, owner });
                    }
                } catch (err) {
                    // console.log(err);
                    history.push("/");
                }
            } else {
                history.push("/");
            }
        };
        handleMount();

        return () => {
            isMounted = false;
        };
    }, [currentUser, history, id]);

    /*
        handles changing the 'bio' field.
    */
    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    /*  
        handles changing the image
    */
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setProfileData({
            ...profileData,
            avatar: URL.createObjectURL(file),
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name.length ? name : owner);
        formData.append("bio", bio);

        if (selectedImage) {
            formData.append("avatar", selectedImage);
        }

        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.avatar,
            }));
            history.goBack();
        } catch (err) {
            // console.log(err);
            setErrors(err.response?.data);
        }
    };

    const textFields = (
        <>
            <Form.Group>
                <Form.Label htmlFor="profileBio">Bio</Form.Label>
                <Form.Control
                    id="profileBio"
                    as="textarea"
                    value={bio}
                    onChange={handleChange}
                    name="bio"
                    rows={7}
                />
            </Form.Group>

            {errors?.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            <Button
                className={`${btnStyles.Button} ${btnStyles.Orange}`}
                onClick={() => history.goBack()}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Orange}`} type="submit">
                save
            </Button>
        </>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
                    <Container className={appStyles.Content}>
                        <Form.Group>
                            {avatar && (
                                <figure>
                                    <Image src={avatar} alt="avatar" fluid />
                                </figure>
                            )}
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Orange} btn my-auto`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>
                            <Form.File
                                hidden
                                id="image-upload"
                                // ref={imageFile}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileEditForm;