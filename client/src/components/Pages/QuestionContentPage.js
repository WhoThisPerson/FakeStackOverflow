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
    //the answers that are currently visible to the user
    const [visible_ans, setVisibleAns] = useState([]);
    //current "index" for the answers (aka which group of 5 answers are in visible at the moment)
    const [ans_index, setAnsIndex] = useState(0);



    //Update answers
    useEffect(() => {
        
        const getQuestion = async () => {
            try {
                setAnsIndex(0);
                const response = await axios.get(`http://localhost:8000/api/questions/${question._id}`);
                setVisibleAns(response.data.answers.slice(ans_index * 5, (ans_index + 1) * 5));
                setAnswers(response.data.answers);
    
            } catch (error) {
                console.error("Failed to find question", error);
            }
        }

        getQuestion();

    }, [question._id]);

    //get the curent batch of answer whenever the index changes 
    useEffect(() => {
        fetchVisibileAnswers()
    }, [ans_index]);

    //Retrieves which questions should be visible
    const fetchVisibileAnswers = ( () => {
        let ans_batch = [];
        //stop at 5 answers in the batch (index determines which 5)
        ans_batch = answers.slice(ans_index * 5, (ans_index + 1) * 5)

        setVisibleAns(ans_batch);
    })

    //makes the prev/next buttons based on index 
    const answerPageButtons = (() => {
        //if there are 5 or less answers, only one page is needed
        if (answers.length <= 5)
            return;

        //check where index lies
            //if index = 0, then remove prev button
            //if index is on the last batch of answers avalible, next button needs to go back to index 0
            //if neither is true, give both prev / next buttons
        if (ans_index === 0)
        {
            return <button className="newest" onClick={() => setAnsIndex(ans_index + 1)}>Next</button>
        }
        else if ((ans_index + 1) * 5 > answers.length)
        {
            return  <> 
            <button className="newest" onClick={() => setAnsIndex(ans_index - 1)}>Prev</button> 
            <button className="newest" onClick={() => setAnsIndex(0)}>Next</button>
            </>
        }
        else 
        {
            return  <> 
            <button className="newest" onClick={() => setAnsIndex(ans_index - 1)}>Prev</button> 
            <button className="newest" onClick={() => setAnsIndex(ans_index + 1)}>Next</button>
            </>
                
        }
    })

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
                {visible_ans.map((answer) => (
                    <Answer key={answer._id} text={answer.text} ans_by={answer.ans_by} ans_date_time={answer.ans_date_time}/>
                ))}

                {answerPageButtons()}
            </div>

            <div className="answer-question-button-container">
                <button onClick={postAnswer} className="answer-question-button">Answer Question</button>
            </div>
        </>
    );
}

