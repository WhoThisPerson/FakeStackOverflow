import { useEffect, useState } from "react";
import axios from "axios";
import Question from "../Question";
import ButtonsContainer from "../ButtonsContainer";

//TODO: check why searching for [c] bugs out results
export default function SearchResultsPage({ navigate, parameters }) {
    //store the parameters
    const { searched_tags, searched_words } = parameters;

    //from home page
    const [questions, setQuestions] = useState([]);
    //the questions that are currently visible to the user
    const [visible_questions, setVisible] = useState([]);
    //current "index" for the questions (aka which group of 5 questions are in visible at the moment)
    const [index, setIndex] = useState(0);


    //Retrieve and store questions
    useEffect(() => {

        axios.get("http://localhost:8000/api/search", { params: { searched_tags, searched_words } })
            .then(response => {
                setIndex(0);
                setVisible(response.data.slice(index * 5, (index + 1) * 5));
                setQuestions(response.data);
            })
            .catch(error => {
                console.error("Failed to get Question data:", error);
            })
    }, [searched_tags, searched_words]);

    //get the curent batch of questions whenever the index changes 
    useEffect(() => {

        fetchVisibileQuestions();

    }, [index]);


    //Retrieves which questions should be visible
    const fetchVisibileQuestions = (() => {
        let question_batch = [];
        //stop at 5 questions in the batch (index determines which 5)
        question_batch = questions.slice(index * 5, (index + 1) * 5)

        setVisible(question_batch);
    })


    const fetchQuestions = async (sortBy) => {

        axios.get(`http://localhost:8000/api/searchbutton?sortBy=${sortBy}`, { params: { searched_tags, searched_words } })
            .then(response => {
                //console.log(response.data);
                //setVisible(response.data.slice(index * 5, (index + 1) * 5));
                setQuestions(response.data);
            })
            .catch(error => {
                console.error("Failed to get Question data:", error);
            })
    }

    //makes the prev/next buttons based on index 
    const pageButtons = (() => {
        //if there are 5 or less questions, only one page is needed
        if (questions.length <= 5)
            return;

        //check where index lies
        //if index = 0, then remove prev button
        //if index is on the last batch of questions avalible, next button needs to go back to index 0
        //if neither is true, give both prev / next buttons
        if (index === 0) {
            return <button className="newest" onClick={() => setIndex(index + 1)}>Next</button>
        }
        else if ((index + 1) * 5 > questions.length) {
            return  <> 
            <button className="newest" onClick={() => setIndex(index - 1)}>Prev</button> 
            <button className="newest" onClick={() => setIndex(0)}>Next</button>
            </>
        }
        else {
            return <> <button className="newest" onClick={() => setIndex(index - 1)}>Prev</button> <button className="newest" onClick={() => setIndex(index + 1)}>Next</button></>

        }
    })

    return (
        <div>
            <div className="right-margin-header">
                <div className="right-margin-header-left">
                    <h1 className="right-margin-header-title">Search Results</h1>
                    <div className="right-margin-header-q-counter">{questions.length} questions</div>
                </div>

                <ButtonsContainer navigate={navigate} fetchQuestions={fetchQuestions} />
            </div>

            {visible_questions.map((question) => (
                <Question key={question._id} question={question} navigate={navigate} />
            ))}

            {pageButtons()}
        </div>

    )
}

