import React from "react";

export default function WelcomePage({navigate}) {

    //Functions to go to different pages
    const registerUser = () => {
        navigate("", "RegisterUser", null);
    }   

    const loginUser = () => {
        navigate("", "LoginUser", null);
    }

    const guestUser = () => {
        navigate("Home", "HomePage", null);
    }

    return (
        <div className="welcome-page">

            <div className="welcome-page-container">

                <div className="register-button-container">
                    <button className="register-button" onClick={registerUser}>Register</button>
                </div>

                <div className="login-button-container">
                    <button className="login-button" onClick={loginUser}>Login</button>
                </div>

                <div className="guest-button-container">
                    <button className="guest-button" onClick={guestUser}>Guest</button>
                </div>
            </div>
        </div>
    )
}