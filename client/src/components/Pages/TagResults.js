import React, { useState, useEffect } from "react";
import Question from "../Question";
import ButtonsContainer from "../ButtonsContainer";
import axios from "axios";

export default function TagResults({ navigate, parameters }) {

    //store the tag
    const { tag } = parameters;
    //get the id for the tag
    const tagID = tag._id;

    //Get all questions
    const [questions, setQuestions] = useState([]);
    //Retrieve and store questions
    useEffect(() => {
        axios.get("http://localhost:8000/api/tag_results", { params: { tagID } })
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.error("Failed to get Question data:", error);
            })
    }, []);

    return (
        <div>
            <div className="right-margin-header">
                <div className="right-margin-header-left">
                    <h1 className="right-margin-header-title">Tags</h1>
                    <div className="right-margin-header-q-counter">{questions.length} Questions</div>
                </div>
            </div>


            {questions.map((question) => (
                <Question key={question._id} question={question} navigate={navigate} />
            ))}
        </div>
    );
}
