import React, { useState, useEffect } from "react";
import { formatDate } from "../util";
import axios from "axios";

export default function Question({question, navigate}) {
    //info for the question
    const {_id, title, summary, text, tags, comments, answers, asked_by, ask_date_time, views, upvotes, downvotes } = question;

    const [username, setUsername] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    //User wants to check question content
    const openQuestionContent = () => {

        updateViewCount();
        //Update view count real time
        question.views += 1;
        navigate("QuestionContentPage", "HomePage", {question});
    }

    const updateViewCount = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/questions/${_id}`);
            //console.log(response.data);
        } catch (error) {
            console.error("Failed to update view count", error);
        }
    }

    useEffect(() => {
        const retrieveUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users/profile", {withCredentials: true});
    
                    if (response.data) {
                        setUserInfo(response.data);
                        setUsername(response.data.username);
                    } 
    
            } catch (error) {
                console.log("Failed to retrieve user Info");
            }
        }

        retrieveUserInfo();
    }, []);

    const updateUpvote = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/questions/upvote/${_id}`, {questionId: _id, userId: username}, {withCredentials: true});
            question.upvotes += 1;
        } catch (error) {
            console.error("Failed to update upvotes");
        }
    }

    //Create date object
    const askDate = new Date(ask_date_time);
    
    return(
        <div className="right-margin-questions">
            <div className="right-margin-left">
                <div>
                    <button onClick={updateUpvote}>Upvote</button>
                    <button>Downvote</button>
                    <div>{upvotes}</div>
                    <div>{downvotes}</div>
                </div>
                <div className="right-margin-questions-answercount">{answers.length} Answers</div>
                <div className="right-margin-questions-viewcount">{views} Views</div>
            </div>

            <div className="right-margin-middle">
                <a href="#" onClick={openQuestionContent} className="right-margin-questions-title">{title}</a>
                <div className="right-margin-question-tags">
                    {tags.map((tag) => (
                        <button key={tag._id} className="question-tag">{tag.name}</button>
                    ))}
                </div>
            </div>

            <div className="right-margin-right">
                <div className="right-margin-questions-askedBy">{username}</div>
                <div className="right-margin-questions-askDate">asked {formatDate(askDate)}</div>
            </div>

        </div>
    );
}
