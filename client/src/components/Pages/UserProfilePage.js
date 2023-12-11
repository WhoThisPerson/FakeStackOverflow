import React, { useEffect, useState } from "react";
import { formatMemberDate } from "../../util";
import axios from "axios";
import User from "../User";

export default function UserProfilePage({navigate}) {
    //Retrieve data from local storage
    const [userInfo, setUserInfo] = useState(null);
    //Will contain list of all Users for Admins
    const [userList, setUserList] = useState([]);
    //Retrieve userInfo
    useEffect(() => {
        const retrieveUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users/profile", {withCredentials: true});

                if (response.data) {
                    setUserInfo(response.data);
                } else {
                    setUserInfo(null);
                }

            } catch (error) {
                console.log("Failed to retrieve user info");
            }
        };

        retrieveUserInfo();
    }, []);
    //Retrieve userList
    useEffect(() => {
        const retrieveUserList = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users", {withCredentials: true});
                if (response.data) {
                    setUserList(response.data); 
                } else {
                    setUserInfo([]);
                }
            } catch (error) {
                console.log("Failed to retrieve list of users");
            }
        }
        retrieveUserList();
    }, []);

    //New Date Object
    let date;
    if (userInfo != null) {
         date = new Date(userInfo.date_created);
    }
    //Handle Log out
    const logOut = async () => {
        //Delete Session
        //Make request to remove user session from server
        try {
            const response = await axios.post("http://localhost:8000/api/users/logout", null, {withCredentials: true});
            if (response.data.success) {
                navigate("", "WelcomePage", null);
            }
        } catch (error) {
            console.log("Failed to logout");
        }
    }
    return(
        <div className="user-profile-page">
            {userInfo ? (
                //Registered User or Admin
                <>
                    <div className="user-profile-header"> 
                        <h1>Username: {userInfo.username}</h1>
                        <h2>Role: {userInfo.role}</h2>
                        <h3>Reputation: {userInfo.reputation}</h3>
                        <h3>Member since: {formatMemberDate(date)}</h3>

                        <div className="user-profile-log-out-container">
                           <button className="user-profile-log-out" onClick={logOut}>Log Out</button>
                        </div>
                    </div>
                    {userInfo.role === "Admin" && (
                        <div className="user-profile-admin">
                            {userList.map((user) => (
                                <User key={user._id} navigate={navigate} user={user}/>
                            ))}
                        </div>
                    )}
                    {userInfo.role === "User" && (
                        <div className="user-profile-user">
                            <h1>User Content</h1>
                        </div>
                    )}
                </>
            ) : (
                //Guest User (No Session)
                <>
                    <div className="user-profile-page-guest">Please Sign In To View Profile.</div>
                </>
            )}
        </div>
    )
}
