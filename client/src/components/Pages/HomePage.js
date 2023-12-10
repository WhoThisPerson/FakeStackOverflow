import { useEffect, useState } from "react";
import ButtonsContainer from "../ButtonsContainer";
import Question from "../Question";
import axios from "axios";

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
           
            setVisible(response.data.slice(index * 5, (index + 1) * 5));
            setQuestions(response.data);

        } catch (error) {
            console.error("Failed to get Question data:", error);
        }
    }

    //Retrieves which questions should be visible
    const fetchVisibileQuestions = ( () => {
        let question_batch = [];
        //stop at 5 questions in the batch (index determines which 5)
        question_batch = questions.slice(index * 5, (index + 1) * 5)

        setVisible(question_batch);
    })

    //makes the prev/next buttons based on index 
    const pageButtons = (() => {
        //check where index lies
            //if index = 0, then remove prev button
            //if index is on the last batch of questions avalible, remove next button
            //if neither is true, give both prev / next buttons
        if (index === 0)
        {
            return <button className="newest" onClick={() => setIndex(index + 1)}>Next</button>
        }
        else if ((index + 1) * 5 > questions.length)
        {
            return <button className="newest" onClick={() => setIndex(index - 1)}>Prev</button>
        }
        else 
        {
            return  <> <button className="newest" onClick={() => setIndex(index - 1)}>Prev</button> <button className="newest" onClick={() => setIndex(index + 1)}>Next</button></>
                
        }
    })

    //Default Newest filter
    useEffect(() => {
        //to set index back to 0
        setIndex(0);
        fetchQuestions("Newest");
    }, []);

    //get the curent batch of questions whenever the index changes 
    useEffect(() => {
        fetchVisibileQuestions()
    }, [index]);

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

            {pageButtons()}
        </>
    );
}
