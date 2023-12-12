import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../util";
import Answer from "../Answer";
import Comment from "../Comment";
import FilteredText from "../FilteredText";
import axios from "axios";

export default function QuestionContentPage({ navigate, parameters }) {

    const { question } = parameters;
    //Retrieve data from local storage
    const [userInfo, setUserInfo] = useState(null);
    //Create Date object to format
    const askDate = new Date(question.ask_date_time);
    //Store and update any new comments 
    const [comments, setComments] = useState([]);
    //state to store the comment that the user is typing
    const [commentText, setCommentText] = useState("");
    //the answers that are currently visible to the user
    const [visible_comments, setVisibleComments] = useState([]);
    //current "index" for the answers (aka which group of 5 answers are in visible at the moment)
    const [comment_index, setCommentIndex] = useState(0);
    //Store and update any new answers
    const [answers, setAnswers] = useState([]);
    //the answers that are currently visible to the user
    const [visible_ans, setVisibleAns] = useState([]);
    //current "index" for the answers (aka which group of 5 answers are in visible at the moment)
    const [ans_index, setAnsIndex] = useState(0);
    //Store username
    const [username, setUsername] = useState("");
    //Retrieve userInfo
    useEffect(() => {
        const retrieveUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/users/profile", {withCredentials: true});

                if (response.data) {
                    setUserInfo(response.data);
                    setUsername(response.data.username);
                } else {
                    setUserInfo(null);
                }

            } catch (error) {
                console.log("Failed to retrieve user info");
            }
        };

        retrieveUserInfo();
    }, []);

    //Update answers
    useEffect(() => {

        const getQuestion = async () => {
            try {
                setCommentIndex(0);
                setAnsIndex(0);

                const response = await axios.get(`http://localhost:8000/api/questions/${question._id}`);

                setVisibleComments(response.data.comments.slice(comment_index * 3, (comment_index + 1) * 3));
                setComments(response.data.comments);

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

    //trigger when comments change 
    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/questions/${question._id}`);

                setVisibleComments(response.data.comments.slice(comment_index * 3, (comment_index + 1) * 3));
                setComments(response.data.comments);

                setVisibleAns(response.data.answers.slice(ans_index * 5, (ans_index + 1) * 5));
                setAnswers(response.data.answers);

            } catch (error) {
                console.error("Failed to get answer's comments", error);
            }
        }

        getComments();
    }, [comments]);

    //get the current batch of comments whenever the comment index changes
    useEffect(() => {
        fetchVisibileComments();
    }, [comment_index]);

    //to add the text to the state variable
    const onInputChange = (event) => {
        setCommentText(event.target.value);
    }

    //handles comment text value 
    const onEnterKey = (event) => {
        //if not the enter key, do nothing
        if (event.code != "Enter") {
            return;
        }

        try {

            const newComment = axios.post("http://localhost:8000/api/question_comments", { user: userInfo, qid: question._id, text: commentText });
            //add it to the comments state
            const new_arr = [...comments];
            new_arr.unshift(newComment);

            //reset index to 0
            setCommentIndex(0);
            setComments(new_arr);


            setCommentText("");
            
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    }

    //Retrieves which comments should be visible
    const fetchVisibileComments = (() => {
        let comment_batch = [];
        //stop at 5 answers in the batch (index determines which 5)
        comment_batch = comments.slice(comment_index * 3, (comment_index + 1) * 3)

        setVisibleComments(comment_batch);
    })

    //makes the prev/next buttons based on index 
    const commentPageButtons = (() => {
        //console.log(userInfo);
        //if there are 3 or less comments, only one page is needed
        if (comments.length <= 3)
            return;

        //check where index lies
        //if index = 0, then remove prev button
        //if index is on the last batch of comments avalible, next button needs to go back to index 0
        //if neither is true, give both prev / next buttons
        if (comment_index === 0) {
            return <button className="newest" onClick={() => setCommentIndex(comment_index + 1)}>Next</button>
        }
        else if ((comment_index + 1) * 3 >= comments.length) {
            return <>
                <button className="newest" onClick={() => setCommentIndex(comment_index - 1)}>Prev</button>
                <button className="newest" onClick={() => setCommentIndex(0)}>Next</button>
            </>
        }
        else {
            return <>
                <button className="newest" onClick={() => setCommentIndex(comment_index - 1)}>Prev</button>
                <button className="newest" onClick={() => setCommentIndex(comment_index + 1)}>Next</button>
            </>

        }
    })

    //Retrieves which answers should be visible
    const fetchVisibileAnswers = (() => {
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
        if (ans_index === 0) {
            return <button className="newest" onClick={() => setAnsIndex(ans_index + 1)}>Next</button>
        }
        else if ((ans_index + 1) * 5 >= answers.length) {
            return <>
                <button className="newest" onClick={() => setAnsIndex(ans_index - 1)}>Prev</button>
                <button className="newest" onClick={() => setAnsIndex(0)}>Next</button>
            </>
        }
        else {
            return <>
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
        navigate("PostAnswerPage", "HomePage", { question });
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
                        <FilteredText text={question.text} />
                    </div>
                </div>

                <div className="question-content-right">
                    <div className="aks-question-button-container">
                        {userInfo ? (<button className="ask-question-button" onClick={askQuestion}>Ask Question</button>) : (<></>)}
                    </div>
                    <div className="question-content-askedBy">{username}</div>
                    <div>asked {formatDate(askDate)}</div>
                </div>
            </div>

            <div className="comments-container">
                {visible_comments.map((comment) => (
                    <Comment key={comment._id} text={comment.text} ans_by={comment.commenter} />
                ))}

                <div>
                    {commentPageButtons()}
                </div>
                

                {userInfo ? (<input type = "text"
                    value = {commentText}
                    rows={2} cols={10} id="post-answer-page-text-input"
                    onKeyDown={onEnterKey}
                    onChange={onInputChange}
                ></input>) : (<></>)}
                
            </div>

            <hr></hr>

            <div>
                {/*Map Answers to Questions */}
                {visible_ans.map((answer) => (
                    <Answer key={answer._id} id =  {answer._id} text={answer.text} ans_by={answer.ans_by} ans_date_time={answer.ans_date_time} />
                ))}

                {answerPageButtons()}
            </div>

            <div className="answer-question-button-container">
                {
                    userInfo ? 
                    (<button onClick={postAnswer} className="answer-question-button">Answer Question</button>) :
                    (<button className="answer-question-button">Please Login to Post An Answer</button>)
                }
            </div>

            
        </>
    );
}

