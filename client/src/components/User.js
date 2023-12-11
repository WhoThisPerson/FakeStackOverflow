import React from "react";

export default function User({navigate, user}) {

    const { username } = user;

    return (
        <div className="user-container">
            <div className="user-info">
                <a href="#" id="username">{username}</a>
            </div>
            <div className="user-delete-container">
                <button className="user-delete-button">Delete</button>
            </div>
        </div>
    )
}