import React, { useEffect, useState } from "react";
import axios from "axios";
import { findLinks } from "../../util";

//TODO: post question is not posting due to changes to database. Make sure to fix 
export default function AskQuestionPage({ navigate }) {
    //state variables for all inputs to the question
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState("");
    const [user, setUser] = useState();
    const [reputation, setReputation] = useState(0);

    //storing input in the respective state variables
    const makingTitle = (event) => {
        setTitle(event.target.value);
    };

    const makingSummary = (event) => {
        setSummary(event.target.value);
    }

    const makingText = (event) => {
        setText(event.target.value);
    };

    const makingTags = (event) => {
        setTags(event.target.value);
    };

    useEffect(() => {
        const retrieveUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users/profile", {withCredentials: true});
    
                    if (response.data) {
                        setUser(response.data._id);
                        setReputation(response.data.reputation);
                    } 
    
            } catch (error) {
                console.log("Failed to retrieve user Info");
            }
        }

        retrieveUserInfo();
    }, []);

    //checks if the links in the text are valid
    const isValidLinks = (() => {
        const links = findLinks(text);

        for (const { hyperlink } of links) {
            //check if the hyperlink is empty
            if (hyperlink.trim().length == 0) {
                alert("Hyperlink cannot be empty");
                return false;
            }

            //check if "https://" or "http://" is the start of the hyperlink
            if (!(hyperlink.startsWith("https://") || hyperlink.startsWith("http://"))) {
                alert("Hyperlink must start with \"https://\ or \"http://\"");
                return false;
            }
        }
        return true;
    });

    //check if the input is all valid
    const validInput = (() => {
        //Check that all fields are filled and valid
        if (title.trim() == "") {
            alert("Title cannot be empty");
            return false;
        }
        if (title.length > 50) {
            alert("Title should not be greater than 50 characters");
            return false;
        }
        if (summary.length > 140) {
            alert("Summary should not be greater than 140 characters.");
            return false;
        }
        if (text.trim() == "") {
            alert("Content cannot be empty");
            return false;
        }
        if (tags.trim() == "") {
            alert("Tags cannot be empty");
            return false;
        }
        const tagsInput = tags.split(" ");
        if (tagsInput[tagsInput.length - 1] == " ") {
            if (tagsInput.length > 5) {
                alert("Maximum number of tags is 5");
                return false;
            }
        }
        return true;
    });
    
    //User is done making question
    //Add question to DB and go back to home page
    const finishAsking = (async (event) => {
        event.preventDefault();
        event.stopPropagation();
        //check if the input values are valid first
        if (!validInput() || !isValidLinks()) {
            return;
        }

        //Check for tag existence
        const tagNames = tags.split(" ").map(tagName => tagName.toLowerCase());

        try {
            //Make request and post Question to questions collection
            const question = {
                title: title,
                summary: summary,
                text: text,
                tags: tagNames,
                asked_by: user,
                user_rep: reputation,
            };
            //response contains created question and associated tags that user is using
            const response = await axios.post("http://localhost:8000/api/questions", { param: question });
            // console.log(response.data);
            //Check user has enough reputation in server
            if (response.data !== "Not enough reputation") {
                try {
                    //Update user's question's posted array
                    //Update tag's created_by array
                    await axios.put("http://localhost:8000/api/users/profile/UpdateQuestion", {question_asked: response.data.question, tags: response.data.tagIDs, user: user}, {withCredentials: true});
                    await axios.put("http://localhost:8000/api/tags", {tags: response.data.tagIDs, user: user}, {withCredentials: true});
                } catch (error) {
                    console.log("Failed to update questions_asked or tags_created");
                }
                navigate("Home", "HomePage", null);
            } else {
                alert("Not enough reputation to add new tag");
                return;
            }
            
        } catch (error) {
            console.error("Error posting question", error);
            return;
        }

    })

    return (
        <div className="ask-question-page">
            <div>
                <h2>Question Title*</h2>
                <div className="question-req">Limit Title to 50 characters or less</div>
                <div className="title-box">
                    <input type="text" id="title-input" onChange={makingTitle}></input>
                </div>
                <h2>Question Summary*</h2>
                <div className="question-req">Limit Summary to 140 characters or less</div>
                <div className="summary-box">
                    <input type="text" id="summary-input" onChange={makingSummary}></input>
                </div>
                <h2>Question Text*</h2>
                <div className="question-box">
                    <textarea rows={4} cols={10} id="question-input" onChange={makingText}></textarea>
                </div>
                <h2>Tags*</h2>
                <div className="question-req">Add keywords separated by whitespace</div>
                <div className="question-req">50+ Reputation Points to Add New Tag</div>
                <div className="tags-box">
                    <input type="text" id="tags-input" onChange={makingTags}></input>
                </div>
                <button id="post-question-button" onClick={finishAsking}>Post Question</button>
            </div>
            <div className="mandatory-text">* indicates mandatory fields</div>
        </div>
    );
}