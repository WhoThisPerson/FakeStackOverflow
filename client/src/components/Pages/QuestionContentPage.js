import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../util";
import Answer from "../Answer";
import FilteredText from "../FilteredText";
import axios from "axios";

export default function QuestionContentPage({navigate, parameters}) {

    const {question} = parameters;
    //Create Date object to format
    const askDate = new Date(question.ask_date_time);
    //Store and update any new answers
    const [answers, setAnswers] = useState([]);

    //Update answers
    useEffect(() => {
        
        const getQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/questions/${question._id}`);
                setAnswers(response.data.answers);
    
            } catch (error) {
                console.error("Failed to find question", error);
            }
        }

        getQuestion();

    }, [question._id]);

    //to go to the ask question page
    const askQuestion = () => {
        navigate("AskQuestion", "HomePage", null);
    }

    //to go to the post answer page
    const postAnswer = () => {
        navigate("PostAnswerPage", "HomePage", {question});
    }

    return (
        <>
            <div className="question-content-container">
                <div className="question-content-left">
                    <div className="question-content-answer-count">{question.answers.length} answers</div>
                    <div className="question-content-view-count">{question.views} views</div>
                </div>

                <div className="question-content-middle">
                    <div className="question-content-title">{question.title}</div>
                    <div className="question-content-text">
                        <FilteredText text={question.text}/>
                    </div>
                </div>

                <div className="question-content-right">
                    <div className="aks-question-button-container">
                        <button onClick={askQuestion} className="ask-question-button">Ask Question</button>
                    </div>
                    <div className="question-content-askedBy">{question.asked_by}</div>
                    <div>asked {formatDate(askDate)}</div>
                </div>
            </div>

            <div>
                {/*Map Answers to Questions */}
                {answers.map((answer) => (
                    <Answer key={answer._id} text={answer.text} ans_by={answer.ans_by} ans_date_time={answer.ans_date_time}/>
                ))}
            </div>

            <div className="answer-question-button-container">
                <button onClick={postAnswer} className="answer-question-button">Answer Question</button>
            </div>
        </>
    );
}

