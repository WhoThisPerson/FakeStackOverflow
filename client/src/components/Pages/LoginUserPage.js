import React, { useState } from "react";
import axios from "axios";

export default function LoginUserPage({navigate}) {
    //State variables to store user info
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const readingEmail = (event) => {
        setEmail(event.target.value);
    }
    
    const readingPassword = (event) => {
        setPassword(event.target.value);
    }

    const validInput = (() => {
        //Check that all fields are not empty
        if (email.trim() == "") {
            alert("Email is empty");
            return false;
        }
        if (password.trim() == "") {
            alert("Password is empty");
            return false;
        }
        return true;
    })

    //Exceptions:
    // Unregistered Email
    // Incorrect Password
    const finishLoggingIn = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        //Field validation
        if (!validInput()) return;

        //Make request to log in
        try {

            const response = await axios.post("http://localhost:8000/api/users/login", {email: email, password: password});
  
            if (response.data == true) {
                //Go to HomePage
                navigate("Home", "HomePage", null);
            } else {
                alert("Failed to Login");
                return;
            }
        } catch (error) {
            console.log("Failed to retrieve login info", error);
        }
    }

    return (
        <div className="login-page">
            <h2>Email</h2>
            <div className="email-container">
                <input type="text" className="login-input" onChange={readingEmail}></input>
            </div>
            <h2>Password</h2>
            <div className="password-container">
                <input type="text" className="password-input" onChange={readingPassword}></input>
            </div>
            <button className="login-button" onClick={finishLoggingIn}>Log In</button>
        </div>
    )
}