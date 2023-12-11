import React from "react";
import axios from "axios";

export default function User({navigate, user}) {

    const { username, _id } = user;

    console.log(_id);

    //DeleteUser
    const deleteUser = async () => {
        try {
            const response = await axios.delete("http://localhost:8000/api/users", {user_id: _id}, {withCredentials: true});

            console.log(response);
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