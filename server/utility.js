//for question filteration 
module.exports.manageSearchedQuestions =  function(previousQuestions, newQuestions) {
    if (previousQuestions.length > 0) {
        //go thru every question that is "new"
        for (const question of newQuestions) {
            //if the question id is not in a previous question, add the question 
            if (!previousQuestions.some(previousQuestion => question._id.equals(previousQuestion._id)))
                previousQuestions.push(question);
        }
    }
    //when there are no previous questions yet, add all new questions
    else
        previousQuestions.push(...newQuestions);
};