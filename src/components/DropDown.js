import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/DropDown.module.css";
import { useHistory } from "react-router-dom";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu

/*
    Component used to display a dropdown menu that conditionally renders
    'edit' and 'delete' options for profiles, posts and comments when apropriate.
*/ 

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    <i
        className="fa-solid fa-ellipsis-vertical"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    />
));

export const DropDown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto" drop="left">
            <Dropdown.Toggle as={ThreeDots}/>

            <Dropdown.Menu 
                className="text-center"
                popperConfig={{ strategy: "fixed" }}
            >
                <Dropdown.Item 
                    className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit"
                >
                    <i className="fa-solid fa-square-pen"></i>
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete"
                >
                    <i className="fa-solid fa-trash"></i>
                </Dropdown.Item>
                
            </Dropdown.Menu>
        </Dropdown>
    );
};

export function ProfileEditDropdown({ id }) {
    const history = useHistory();
    return (
        <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
            <Dropdown.Toggle as={ThreeDots} />
            <Dropdown.Menu>
                <Dropdown.Item
                    className={styles.DropdownItemProfile}
                    onClick={() => history.push(`/profiles/${id}/edit`)}
                    aria-label="edit-profile"
                >
                    <i className="fas fa-edit" /> edit profile
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItemProfile}
                    onClick={() => history.push(`/profiles/${id}/edit/username`)}
                    aria-label="edit-username"
                >
                    <i className="far fa-id-card" />
                    change username
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItemProfile}
                    onClick={() => history.push(`/profiles/${id}/edit/password`)}
                    aria-label="edit-password"
                >
                    <i className="fas fa-key" />
                    change password
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}