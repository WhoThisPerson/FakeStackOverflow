import React from "react";
import axios from "axios";

export default function User({navigate, user}) {

    const { username, _id } = user;
    //DeleteUser
    const deleteUser = async () => {
        try {
            console.log(_id);
            const response = await axios.delete("http://localhost:8000/api/users", {user_id: _id}, {withCredentials: true});

            if (response) {
                console.log("Ok");
            } else {
                console.log("Failed to delete user");
            }

        } catch (error) {
            console.log("Failed to delete user");
        }
    }

    return (
        <div className="user-container">
            <div className="user-info">
                <a href="#" id="username">{username}</a>
            </div>
            <div className="user-delete-container">
                <button className="user-delete-button" onClick={deleteUser}>Delete</button>
            </div>
        </div>
    )
}