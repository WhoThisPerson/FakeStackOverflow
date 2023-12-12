import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

export default function ButtonsContainer({navigate, fetchQuestions}) {

    //Retrieve data from local storage
    const [userInfo, setUserInfo] = useState(null);

    //Retrieve userInfo when component loads
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

    //go to Ask Question Page
    const askQuestion = () => {
        navigate("AskQuestion", "HomePage", null);
    };
    //Go back to Home with Newest Filter On
    const newestButton = () => {
        fetchQuestions("Newest");
    };
    //go back to Home with Active Filter On
    const activeButton = () => {
        fetchQuestions("Active");
    };
    //go back to Home with Unanswered Filter on
    const unansweredButton = () => {
        fetchQuestions("Unanswered");
    };

    return (
        <div className="right-margin-header-right">
            <div className="ask-question-button-container">
                {userInfo ? (<button className="ask-question-button" onClick={askQuestion}>Ask Question</button>) : (<></>)}
            </div>
            <div className="right-margin-three-buttons-container">
                <button className="newest" onClick={newestButton}>Newest</button>
                <button className="active" onClick={activeButton}>Active</button>
                <button className="unanswered" onClick={unansweredButton}>Unanswered</button>
            </div>
        </div>
    );
}
