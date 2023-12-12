import { useEffect, useState } from "react";
import { formatDate } from "../util";
import FilteredText from "./FilteredText";
import axios from "axios";
import Comment from "./Comment";

export default function Answer({ id, text, ans_by, ans_date_time }) {

    const ansDate = new Date(ans_date_time);
    //Retrieve data from local storage
    const [userInfo, setUserInfo] = useState(null);
    //Store and update any new comments 
    const [comments, setComments] = useState([]);
    //the answers that are currently visible to the user
    const [visible_comments, setVisibleComments] = useState([]);
    //current "index" for the answers (aka which group of 5 answers are in visible at the moment)
    const [comment_index, setCommentIndex] = useState(0);
    //state to store the comment that the user is typing
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const getComments = async () => {
            try {
                setCommentIndex(0);

                const response = await axios.get(`http://localhost:8000/api/answers/${id}`);

                setVisibleComments(response.data.comments.slice(comment_index * 3, (comment_index + 1) * 3));
                setComments(response.data.comments);

            } catch (error) {
                console.error("Failed to get answer's comments", error);
            }
        }

        getComments();

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

    //trigger when comments change 
    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/answers/${id}`);

                setVisibleComments(response.data.comments.slice(comment_index * 3, (comment_index + 1) * 3));
                setComments(response.data.comments);

            } catch (error) {
                console.error("Failed to get answer's comments", error);
            }
        }

        getComments();
    }, [comments]);

    //get the current batch of comments whenever the comment index changes
    useEffect(() => {
        let comment_batch = [];
        //stop at 5 answers in the batch (index determines which 5)
        comment_batch = comments.slice(comment_index * 3, (comment_index + 1) * 3);

        setVisibleComments(comment_batch);
    }, [comment_index]);

    //makes the prev/next buttons based on index 
    const commentPageButtons = (() => {
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
            event.preventDefault();
            //post the new comment and get the data for it
            const newComment = axios.post("http://localhost:8000/api/answer_comments", { user: userInfo, aid: id, text: commentText });
            //add it to the comments state
            const new_arr = [...comments];
            new_arr.unshift(newComment);

            //reset index to 0
            setCommentIndex(0);
            setComments(new_arr);

            console.log(comments);
            setCommentText("");
            

        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    }

    return (
        <div className="answer-container">
            <div className="answer-left">
                <div className="answer-text">
                    <FilteredText text={text} />
                </div>
            </div>
            <div className="answer-right">
                <div className="answer-user">{ans_by}</div>
                <div>answered {formatDate(ansDate)}</div>
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
                    rows={4} cols={5} id="post-answer-page-text-input"
                    onKeyDown={onEnterKey}
                    onChange={onInputChange}
                ></input>) : (<></>)}
                

            </div>

        </div>
    );
} 
