import React, { useState } from "react";
import axios from "axios";
import { findLinks } from "../../util";

//TODO: post question is not posting due to changes to database. Make sure to fix 
export default function AskQuestionPage({ navigate }) {
    //state variables for all inputs to the question
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState("");
    const [username, setUsername] = useState("");

    //storing input in the respective state variables
    const makingTitle = (event) => {
        setTitle(event.target.value);
    };

    const makingText = (event) => {
        setText(event.target.value);
    };

    const makingTags = (event) => {
        setTags(event.target.value);
    };

    const makingUsername = (event) => {
        setUsername(event.target.value);
    };

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
        if (title.length > 100) {
            alert("Title should not be greater than 100 words");
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
        if (username.trim() == "") {
            alert("Username cannot be empty");
            return false;
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
                text: text,
                tags: tagNames,
                asked_by: username,
            };

            await axios.post("http://localhost:8000/api/questions", { param: question });
            
            navigate("Home", "HomePage", null);
            
        } catch (error) {
            console.error("Error posting question", error);
            return;
        }

    })

    return (
        <div className="ask-question-page">
            <div>
                <h2>Question Title*</h2>
                <div className="question-req">Limit Title to 100 characters or less</div>
                <div className="title-box">
                    <input type="text" id="title-input" onChange={makingTitle}></input>
                </div>
                <h2>Question Text*</h2>
                <div className="question-box">
                    <textarea rows={4} cols={10} id="question-input" onChange={makingText}></textarea>
                </div>
                <h2>Tags*</h2>
                <div className="question-req">Add keywords separated by whitespace</div>
                <div className="tags-box">
                    <input type="text" id="tags-input" onChange={makingTags}></input>
                </div>
                <h2>Username*</h2>
                <div>
                    <input type="text" id="username-input" onChange={makingUsername}></input>
                </div>
                <button id="post-question-button" onClick={finishAsking}>Post Question</button>
            </div>
            <div className="mandatory-text">* indicates mandatory fields</div>
        </div>
    );
}