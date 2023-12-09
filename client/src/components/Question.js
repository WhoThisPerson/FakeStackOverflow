import { formatDate } from "../util";
import axios from "axios";

export default function Question({question, navigate}) {

    const {_id, title, summary, text, tags, comments, answers, asked_by, ask_date_time, views, upvotes, downvotes } = question;
    
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
            console.log(response.data);
        } catch (error) {
            console.error("Failed to update view count", error);
        }
    }
    
    //Create date object
    const askDate = new Date(ask_date_time);
    
    return(
        <div className="right-margin-questions">
            <div className="right-margin-left">
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
                <div className="right-margin-questions-askedBy">{asked_by}</div>
                <div className="right-margin-questions-askDate">asked {formatDate(askDate)}</div>
            </div>

        </div>
    );
}
