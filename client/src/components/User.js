import React from "react";
import axios from "axios";

export default function User({navigate, user}) {

    const { username, _id } = user;
    //DeleteUser
    const deleteUser = async () => {

        const confirmation = window.confirm("Are you sure you want to delete this user?");

        if (!confirmation) return;

        try {
            await axios.delete("http://localhost:8000/api/users", {data: {user_id: _id}}, {withCredentials: true});

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