import { useEffect, useState } from "react";
import axios from "axios"; 
import Question from "../Question";
import ButtonsContainer from "../ButtonsContainer";

export default function SearchResultsPage( { navigate, parameters } ) {
    //store the parameters
    const { searched_tags, searched_words } = parameters;
    
    //from home page
    const [questions, setQuestions] = useState([]);
    //Retrieve and store questions
    useEffect(() => {

        axios.get("http://localhost:8000/api/search", { params: {searched_tags, searched_words } })
        .then(response => {
            setQuestions(response.data);
        })
        .catch(error => {
            console.error("Failed to get Question data:", error);
        })
    }, [searched_tags, searched_words]);

    const fetchQuestions = async (sortBy) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/questions?sortBy=${sortBy}`)
            setQuestions(response.data);

        } catch (error) {
            console.error("Failed to get Question data:", error);
        }
    }

    return (
        <div>
            <div className="right-margin-header">
                <div className="right-margin-header-left">
                    <h1 className="right-margin-header-title">Search Results</h1>
                    <div className="right-margin-header-q-counter">{questions.length} questions</div>
                </div>

                <ButtonsContainer navigate={navigate} fetchQuestions={fetchQuestions}/>
            </div>

            {questions.map((question) => (
                <Question key={question._id} question={question} navigate={navigate}/>
            ))}

        </div>

    )
}

