import React, { useState } from "react";
import axios from "axios";
import { validEmail } from "../../util";

export default function RegisterUserPage({navigate}) {
    //State variables to store user info
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [secretPass, setSecretPass] = useState("");
    const [passVer, setPassVer] = useState("");

    const makingEmail = (event) => {
        setEmail(event.target.value);
    }

    const makingUsername = (event) => {
        setUsername(event.target.value);
    }

    const makingSecretPass = (event) => {
        setSecretPass(event.target.value);
    }

    const makingPassVer = (event) => {
        setPassVer(event.target.value);
    }

    const validInput = (() => {
        //Check that all fields are not empty
        if (email.trim() == "") {
            alert("Email cannot be empty");
            return false;
        }
        if (username.trim() == "") {
            alert("Username cannot be empty");
            return false;
        }
        if (secretPass.trim() == "") {
            alert("Secret Password cannot be empty");
            return false;
        }
        if (passVer.trim() == "") {
            alert("Password Verification cannot be empty");
            return false;
        }
        //Check for Valid Email
        if (!validEmail(email)) {
            alert("Not a valid email");
            return false;
        }
        //Check that passwords are the same
        if (secretPass !== passVer) {
            alert("Passwords do not match. Please try again.");
            return false;
        }
        const tempEmail = email.toLowerCase();
        const tempUser = username.toLowerCase();
        const tempPass = secretPass.toLowerCase();
        //Password does not contain email or username
        if(tempPass.includes(tempEmail) || (tempPass.includes(tempUser))) {
            alert("Password cannot contain Email or Username");
            return false;
        }
        return true;
    })

    //Functions to retrieve specified data fields
    //Exceptions: 
    // No two users with same email
    // Email valid
    // Password cannot contain username or email id
    const finishRegistering = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        //Field validation
        if (!validInput()) return;

        try {
            //Make request
            const response = await axios.post("http://localhost:8000/api/users/", {username: username, email: email, password: secretPass});
            //Confirm that user does not exist
            if (response.data == "User does not exist") {
                //Go to Login Page
                navigate("", "LoginUser", null);
            } else {
                alert("Email already exists");
                return;
            }
        } catch (error) {
            console.log("Failed to register.");
            return;
        }
    }
    
    return (
        <div className="register-user-page">
            <h2>Email</h2>
            <div className="email-container">
                <input type="text" className="register-email-input" onChange={makingEmail}></input>
            </div>
            <h2>Username</h2>
            <div className="username-container">
                <input type="text" className="register-username-input" onChange={makingUsername}></input>
            </div>
            <h2>Secret Password</h2>
            <div className="secret-password-container">
                <input type="text" className="register-secretpassword-input" onChange={makingSecretPass}></input>
            </div>
            <h2>Password Verification</h2>
            <div className="password-verification-container">
                <input type="text" className="register-passverify-input" onChange={makingPassVer}></input>
            </div>
            <button className="sign-up-button" onClick={finishRegistering}>Sign Up</button>
        </div>
    )
}