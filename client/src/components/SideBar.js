import React from "react";

export default function SideBar({currentPage, navigate}) {
    //go to home page if quesiton option is clicked
    const handleQuestionClick = () => {
        navigate("Home", "HomePage", null);
    };

    //go to Tags page if tagsoption is clicked
    const handleTagsClick = () => {
        navigate("Tags", "HomePage", null);
    };

    const handleUserProfileClick = () => {
        navigate("UserProfile", "HomePage", null);
    }

    //to change the background colors of the options
    //keep questions option background on if not in the Tags page
    const changeQuestionsBackground = {
        backgroundColor: currentPage !== "Tags" && currentPage !== "TagResults" && currentPage !== "UserProfile" ? "lightgray" : "transparent"
    };
    
    const changeTagsBackground = {
        backgroundColor: currentPage === "Tags" || currentPage === "TagResults" ? "lightgray" : "transparent"
    };

    const changeUserProfileBackground = {
        backgroundColor: currentPage === "UserProfile" ? "lightgray" : "transparent"
    }

    return (
        <div className="left-margin">
            <div className="question-link-container" style={changeQuestionsBackground}>
                <a href="#" id="question-link" onClick={handleQuestionClick}>Questions</a>
            </div>
            <div className="tag-link-container" style={changeTagsBackground}>
                <a href="#" id="tag-link" onClick={handleTagsClick}>Tags</a>
            </div>
            <div className="user-link-container" style={changeUserProfileBackground}>
                <a href="#" id="user-link" onClick={handleUserProfileClick}>User</a>
            </div>
        </div>
    );
}
