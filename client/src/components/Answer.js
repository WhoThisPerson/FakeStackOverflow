import { formatDate } from "../util";
import FilteredText from "./FilteredText";

export default function Answer({text, ans_by, ans_date_time}) {

    const ansDate = new Date(ans_date_time);

    return (
        <div className="answer-container">
            <div className="answer-left">
                <div className="answer-text">
                    <FilteredText text={text}/>
                </div>
            </div>
            <div className="answer-right">
                <div className="answer-user">{ans_by}</div>
                <div>answered {formatDate(ansDate)}</div>
            </div>

        </div>  
    );
} 
