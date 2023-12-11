import { useEffect } from "react";
import { formatDate } from "../util";
import FilteredText from "./FilteredText";

export default function Answer({text, ans_by, ans_date_time}) {

    const ansDate = new Date(ans_date_time);

    useEffect(() => {
        //TODO: 
            //get request to get all the comments for this answer
            //store it in a state 
            //add the index bs here too
            //do a map to all the comments 
    }, []);

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
