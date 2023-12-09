import React, { useEffect, useState } from "react";
import ButtonsContainer from "../ButtonsContainer";
import axios from "axios";
import TagNumber from "../TagNumber";


export default function TagsPage({ navigate }) {

    const [tags, setTags] = useState([]);
    //Retrieve and store tags
    useEffect(() => {
        axios.get("http://localhost:8000/api/tags")
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error("Failed to get Tag data", error);
            })
    }, []);

   

    //go to tag Results page
    const goToResults = ((tag) => {
        return navigate("TagResults", { tag });
    });

    //get the number of questions with this tag


    return (
        <>
            <div className="right-margin-header">
                <div className="right-margin-header-left">
                    <h1 className="right-margin-header-title">Tags</h1>
                    <div className="right-margin-header-q-counter">{tags.length} Tags</div>
                </div>
            </div>

            <div className="tags-container">
                {tags.map((t) => (
                    <div key={t._id} className="tag-container">
                        <div>
                            <a href="#" onClick={() => goToResults(t)}>{t.name}</a>
                        </div>

                        <TagNumber tag={t} />

                    </div>
                ))}
            </div>

        </>
    );
}

