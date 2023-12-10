import { formatDate } from "../util";
import FilteredText from "./FilteredText";

export default function Comment({text, ans_by, comment_date_time}) {
    const commentDate = new Date(comment_date_time);

    return (
        <div className="answer-container">
            <div className="answer-left">
                <div className="answer-text">
                    <FilteredText text={text}/>
                </div>
            </div>
            <div className="answer-right">
                <div className="answer-user">{ans_by}</div>
                <div>Commented {formatDate(commentDate)}</div>
            </div>

        </div>  
    );
}