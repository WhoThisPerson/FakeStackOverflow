import React, {useState} from 'react';

export default function Header({navigate}) {
    //to store input text in the search bar
    const [inputText, setInputText] = useState("");

    //to add the text to the state variable
    const onInputChange = (event) => {
        setInputText(event.target.value);
    }

    //when user wants to look something up
    const onEnterKey = (event) => {
        //if not the enter key, do nothing
        if (event.code != "Enter") {
            return;
        }

        //split the input into seperate words and store it 
        const inputs = inputText.split(" ");
        //to store the searched tags and words 
        const searched_tags = [];
        const searched_words = [];

        //go thru every word inputted
        for (const word of inputs) {
            const lowerCased = word.toLowerCase();
            //check if the word starts and ends with [] (means its a tag)
            if (lowerCased.charAt(0) == "[" && lowerCased.charAt(lowerCased.length - 1) == "]") {
                searched_tags.push(lowerCased);
            }
            //the word is not a tag 
            else
                searched_words.push(lowerCased);
        }

        //go to home page with the searched inputs as parameters
        navigate("SearchResults", "HomePage" ,{searched_tags, searched_words});
    }

    return (
        <div className='header'>
            <h1 className='title'>Fake Stack Overflow</h1>

            <div id='search-box'>
                <input id='search-input'
                    type='text'
                    placeholder='Search. . .'
                    value={inputText}
                    onKeyDown={onEnterKey}
                    onChange={onInputChange}
                />
            </div>
        </div>
    );
}
