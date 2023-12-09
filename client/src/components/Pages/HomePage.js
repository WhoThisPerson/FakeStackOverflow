import { useEffect, useState } from "react";
import ButtonsContainer from "../ButtonsContainer";
import Question from "../Question";
import axios from "axios";

export default function HomePage({ navigate }) {

    const [questions, setQuestions] = useState([]);
    //Retrieve and store questions

    const fetchQuestions = async (sortBy) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/questions?sortBy=${sortBy}`)
            setQuestions(response.data);

        } catch (error) {
            console.error("Failed to get Question data:", error);
        }
    }
    //Default Newest filter
    useEffect(() => {
        fetchQuestions("Newest");
    }, []);

    return (
        <>
            <div className="right-margin-header">
                <div className="right-margin-header-left">
                    <h1 className="right-margin-header-title">All Questions</h1>
                    <div className="right-margin-header-q-counter">{questions.length} questions</div>
                </div>

                <ButtonsContainer navigate={navigate} fetchQuestions={fetchQuestions}/>
            </div>
            {questions.map((question) => (
                <Question key={question._id} question={question} navigate={navigate}/>
            ))}
        </>
    );
}
