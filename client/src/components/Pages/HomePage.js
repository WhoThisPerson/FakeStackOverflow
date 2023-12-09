import { useEffect, useState } from "react";
import ButtonsContainer from "../ButtonsContainer";
import Question from "../Question";
import axios from "axios";

//TODO: 
//Ask why questions and visibile_questions keep changing 
export default function HomePage({ navigate }) {

    //collection of all questions in the database
    const [questions, setQuestions] = useState([]);
    //the questions that are currently visible to the user
    const [visible_questions, setVisible] = useState([]);
    //current "index" for the questions (aka which group of 5 questions are in visible at the moment)
    const [index, setIndex] = useState(0);

    //Retrieve and store questions
    const fetchQuestions = async (sortBy) => {
        try {
            //const end_index = index + 1;
            const response = await axios.get(`http://localhost:8000/api/questions?sortBy=${sortBy}`)
           
            setQuestions(response.data);

            fetchVisibileQuestions();
            console.log(visible_questions);

        } catch (error) {
            console.error("Failed to get Question data:", error);
        }
    }

    //Retrieves which questions should be visible
    const fetchVisibileQuestions = (() => {
        let question_batch = [];
        //stop at 5 questions in the batch (index determines which 5)
        question_batch = questions.slice(index * 5, (index + 1) * 5)

        setVisible(question_batch);

        //console.log(visible_questions);

            // {questions.map((question) => (
            //     <Question key={question._id} question={question} navigate={navigate} />
            // ))}
    })

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

                <ButtonsContainer navigate={navigate} fetchQuestions={fetchQuestions} />
            </div>
            
             {visible_questions.map((question) => (
                 <Question key={question._id} question={question} navigate={navigate} />
             ))}
        </>
    );
}
