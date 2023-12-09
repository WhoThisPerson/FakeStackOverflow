import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TagNumber({tag})
{
    //get the id of the tag
    let tagID = tag._id;
    //store number 
    const [num, setNum] = useState(0);

    useEffect(
        () => {
            axios.get("http://localhost:8000/api/tags_number", { params: { tagID }})
                .then(response => {
                    const arr = response.data;
                    setNum(arr.length);
                })
                .catch(error => {
                    console.error("Failed to get number of questions under tag", error);
                })
        }, []);

    return (
        <div>
            {num} questions
        </div>
    )

}
