import React, { useState } from "react";
import { findLinks } from "../../util";
import axios from "axios";

export default function PostAnswerPage({navigate, parameters}) {

    //State variables for all inputs to the answer
    const [username, setUsername] = useState("");
    const [text, setText] = useState("");
    const {question} = parameters;

    //storing input in the respective state variables
    const makingUsername = (event) => {
        setUsername(event.target.value);
    }

    const makingText = (event) => {
        event.preventDefault();
        const text = event.target.value;
        const regex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;

        const words = text.split(" ");

        const newText = words.map((word) => {
            const match = regex.exec(word);
            if (match) {
                const name = match[1];
                const url = match[2];

                return (
                    <div>
                        <a href={url}>{name}</a>
                    </div>
                )
            } else {
                return word;
            }
        })
        setText(newText.join(" "));
    }

    //Check for valid input
    const validInput = (() => {
        //Initially checking that parameters are not empty
        if (username.trim() === 0) {
            alert("Username cannot be empty");
            return false;
        }
        if (text.trim() === 0) {
            alert("Text cannot be empty");
            return false;
        }
        return true;
    })
    //Checks if the links in the text are valid
    const isValidLinks = (() => {
        const links = findLinks(text);

        for (const {hyperlink} of links) {
            //Checkif the hyperlink is empty
            if (hyperlink.trim().length == 0) {
                alert("Hyperlink cannot be empty");
                return false;
            }

            //check if "https://" or "http://" is the start of the hyperlink
            if (!(hyperlink.startsWith("https://") || hyperlink.startsWith("http://"))) {
                alert("Hyperlink must start with \"https://\ or \"http://\" ");
                return false;
            }
        }
        return true;
    })

    //User is done with posting answer
    const finishPosting = (async (event) => {
        event.preventDefault();
        event.stopPropagation();
        //Check if inputs are valid
        if (!validInput() || !isValidLinks()) {
            return;
        }
        //Create Answer
        //Post Answer to answers collection
        try {

            const newAnswer = await axios.post("http://localhost:8000/api/answers", 
            { text: text, ans_by: username, ans_date_time: new Date(), questionID : question._id});

            console.log(newAnswer.data);

            navigate("QuestionContentPage", { question });

        } catch (error) {
            console.error("Failed to post Answer", error);
        }
    });

    return (
        <div className="post-answer-page">
            <>
                <h2>Username*</h2>
                <div className="post-answer-page-username-box">
                    <input type="text" id="post-answer-page-username-input" onChange={makingUsername}></input>
                </div>
                <h2>Answer Text*</h2>
                <div className="post-answer-text-box">
                    <textarea rows={4} cols={10} id="post-answer-page-text-input" onChange={makingText}></textarea>
                </div>

                <div className="post-answer-button-container">
                    <button className="post-answer-button" onClick={finishPosting}>Post Answer</button>
                </div>
                <div className="mandatory-text">* indicates mandatory fields</div>
            </>
        </div>
    );
}
