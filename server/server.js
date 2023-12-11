// Application server
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 8000;
const url = "mongodb://127.0.0.1:27017/fake_so";

const secretKey = process.argv[2];
console.log(secretKey);
//Check for input key
if (secretKey == null) {
    console.log("Enter a session key")
    process.exit(0);
}

//get the models 
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');
const { manageSearchedQuestions } = require('./utility');
const Comment = require('./models/comments');

//Middleware
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        secure: false,
        httpOnly: true,
    },
}));

//Questions Get Request
app.get("/api/questions", async (req, res) => {
    try {
        let questions = await Question.find()
            .populate("tags")
            .populate("answers")
            .populate("comments");
        //Default sorting to Newest
        const sortBy = req.query.sortBy || "Newest";
        //New Posted Questions at Top
        if (sortBy === "Newest") {

            questions = questions.sort((a, b) => {
                return (b.ask_date_time - a.ask_date_time);
            });
        } else if (sortBy === "Active") {

            questions = questions.sort((a, b) => {
                const mostRecentAAnswer = a.answers.length > 0 ? a.answers[0].ans_date_time : null;
                const mostRecentBAnswer = b.answers.length > 0 ? b.answers[0].ans_date_time : null;

                if (mostRecentAAnswer && mostRecentBAnswer) {
                    return (mostRecentBAnswer - mostRecentAAnswer);
                } else if (mostRecentBAnswer) {
                    return 1;
                } else if (mostRecentAAnswer) {
                    return -1;
                }
            })

        } else if (sortBy === "Unanswered") {
            questions = questions.filter((question) => question.answers.length === 0);
        }


        const sortedQuestions = questions;

        res.json(sortedQuestions);
    } catch (error) {
        console.error("Failed to fetch questions", error);
    }
})
//Answers Get Request
app.get("/api/answers", async (req, res) => {
    try {
        const answers = await Answer.find().populate("comments");
        res.json(answers);
    } catch (error) {
        console.error("Failed to fetch answers", error);
    }
})
//Tags Get Request
app.get("/api/tags", async (req, res) => {
    try {
        const tags = await Tag.find().populate("created_by");
        res.json(tags);
    } catch (error) {
        console.error("Failed to fetch tags", error);
    }
})

//Tags Num GET request 
app.get("/api/tags_number", async (req, res) => {
    try {
        const tagID = req.query["tagID"];

        //get all questions with the tag
        const questionsInTag = await Question.find({ tags: { _id: tagID } })
            .populate("tags")
            .populate("answers");

        res.json(questionsInTag);
    }
    catch (error) {
        console.error("Failed to fetch number of questions under a tag", error);
    }
})

//Tags Results GET Request
app.get("/api/tag_results", async (req, res) => {
    try {
        const tagID = req.query["tagID"];

        //get all questions with the tag
        const questionsInTag = await Question.find({ tags: { _id: tagID } })
            .populate("tags")
            .populate("answers");

        res.json(questionsInTag);
    } catch (error) {
        console.error("Failed to fetch questions with tags", error);
    }
})

//Search Results Get Request 
app.get("/api/search", async (req, res) => {
    try {
        const searched_tags = req.query["searched_tags"];
        const searched_words = req.query["searched_words"];

        //stored all the questions with the proper tags
        const tagged_questions = [];

        //check if any tags were searched
        if (searched_tags != undefined) {
            //go thru every tag 
            for (let word of searched_tags) {
                //to get rid of the [] and case sensitivity 
                word = word.substring(1, word.length - 1).toLowerCase();
                //find the tag in the collection (not case sensitive)
                let tag = await Tag.find({ name: { $regex: word, $options: "i" } });

                //check if the tag exists
                //go to the next searched tag if doesn't exist 
                //find returns an array, so checking if the length is 0 works out
                if (tag.length == 0)
                    continue;

                //get the tag ID
                const tagID = tag[0]._id;

                //get all questions with the tag
                const questionsInTag = await Question.find({ tags: { _id: tagID } })

                manageSearchedQuestions(tagged_questions, questionsInTag);

            }
        }


        //store all the questions with the word in its text / title
        const searched_questions = [];
        //get every question
        const questionsCollection = await Question.find();

        //check if any words were searched 
        if (searched_words != undefined) {
            //search the Database for each word 
            for (let word of searched_words) {
                //returns all questions with the word in the title 
                //for each question, split the title by whitespace 
                //see if any of the words in the title is the word being searched 
                //ToLowerCase() is to avoid case sensitivity 

                let titlesWithWord = questionsCollection.filter(question => question.title.split(" ")
                    .some((wordInTitle) => wordInTitle.toLowerCase() == word));

                //compares searchedQuestions to titlesWithWord to see if there are any duplicates
                manageSearchedQuestions(searched_questions, titlesWithWord);

                //returns all questions with the word in the text (same way as with title)
                let textWithWord = questionsCollection.filter(question => question.text.split(" ")
                    .some((wordInText) => wordInText.toLowerCase() == word));


                //same as before to make sure textWithWords is all new 
                manageSearchedQuestions(searched_questions, textWithWord);
            }
        }


        //get the ids of all questions with a searched tag
        const result_ids = [];
        for (let question of tagged_questions)
            result_ids.push(question._id);

        //go thru every question with a searched word 
        for (const question of searched_questions) {
            //check if the question hasn't been chosen already in tagged question 
            //add the question's id if new
            if (!tagged_questions.some(tagged => tagged._id.equals(question._id)))
                result_ids.push(question._id);
        }


        //make an new query that will populate the tags and answers 
        const result = await Question.find({ _id: { $in: result_ids } })
            .populate("tags")
            .populate("answers");

        res.json(result);
    }

    catch (error) {
        console.error("Failed to get search results", error);
    }

})

//Search Results Get Request 
app.get("/api/searchbutton", async (req, res) => {
    try {

        const searched_tags = req.query["searched_tags"];
        const searched_words = req.query["searched_words"];

        //stored all the questions with the proper tags
        const tagged_questions = [];

        //check if any tags were searched
        if (searched_tags != undefined) {
            //go thru every tag 
            for (let word of searched_tags) {
                //to get rid of the [] and case sensitivity 
                word = word.substring(1, word.length - 1).toLowerCase();
                //find the tag in the collection (not case sensitive)
                let tag = await Tag.find({ name: { $regex: word, $options: "i" } });

                //check if the tag exists
                //go to the next searched tag if doesn't exist 
                //find returns an array, so checking if the length is 0 works out
                if (tag.length == 0)
                    continue;

                //get the tag ID
                const tagID = tag[0]._id;

                //get all questions with the tag
                const questionsInTag = await Question.find({ tags: { _id: tagID } })

                manageSearchedQuestions(tagged_questions, questionsInTag);

            }
        }


        //store all the questions with the word in its text / title
        const searched_questions = [];
        //get every question
        const questionsCollection = await Question.find();

        //check if any words were searched 
        if (searched_words != undefined) {
            //search the Database for each word 
            for (let word of searched_words) {
                //returns all questions with the word in the title 
                //for each question, split the title by whitespace 
                //see if any of the words in the title is the word being searched 
                //ToLowerCase() is to avoid case sensitivity 

                let titlesWithWord = questionsCollection.filter(question => question.title.split(" ")
                    .some((wordInTitle) => wordInTitle.toLowerCase() == word));

                //compares searchedQuestions to titlesWithWord to see if there are any duplicates
                manageSearchedQuestions(searched_questions, titlesWithWord);

                //returns all questions with the word in the text (same way as with title)
                let textWithWord = questionsCollection.filter(question => question.text.split(" ")
                    .some((wordInText) => wordInText.toLowerCase() == word));


                //same as before to make sure textWithWords is all new 
                manageSearchedQuestions(searched_questions, textWithWord);
            }
        }


        //get the ids of all questions with a searched tag
        const result_ids = [];
        for (let question of tagged_questions)
            result_ids.push(question._id);

        //go thru every question with a searched word 
        for (const question of searched_questions) {
            //check if the question hasn't been chosen already in tagged question 
            //add the question's id if new
            if (!tagged_questions.some(tagged => tagged._id.equals(question._id)))
                result_ids.push(question._id);
        }


        //make an new query that will populate the tags and answers 
        let result = await Question.find({ _id: { $in: result_ids } })
            .populate("tags")
            .populate("answers");

        //Default sorting to Newest
        const sortBy = req.query.sortBy || "Newest";
        //New Posted Questions at Top
        if (sortBy === "Newest") {

            result = result.sort((a, b) => {
                return (b.ask_date_time - a.ask_date_time);
            });
        } else if (sortBy === "Active") {

            result = result.sort((a, b) => {
                const mostRecentAAnswer = a.answers.length > 0 ? a.answers[0].ans_date_time : null;
                const mostRecentBAnswer = b.answers.length > 0 ? b.answers[0].ans_date_time : null;

                if (mostRecentAAnswer && mostRecentBAnswer) {
                    return (mostRecentBAnswer - mostRecentAAnswer);
                } else if (mostRecentBAnswer) {
                    return 1;
                } else if (mostRecentAAnswer) {
                    return -1;
                }
            })

        } else if (sortBy === "Unanswered") {
            result = result.filter((question) => question.answers.length === 0);
        }


        const sortedQuestions = result;

        res.json(sortedQuestions);

        //res.json(result);
    }

    catch (error) {
        console.error("Failed to get search results", error);
    }

})

//Question Post Request
app.post("/api/questions", async (req, res) => {
    try {
        const { param } = req.body;
        //stores the IDS of tags for the posted question
        const tagIDs = [];

        for (const tagName of param.tags) {
            //Determine if tagName exists (remeber that find returns an array)
            const existingTag = await Tag.find({ name: tagName });

            //if the tag doesn't exist
            if (existingTag.length == 0) {
                //Create new tag
                const tag = new Tag({
                    name: tagName
                });
                //Save to tags collection
                await tag.save();
                //store the id of the new tag
                tagIDs.push(tag._id);
            }
            else
                tagIDs.push(existingTag[0]._id);
        }
        //Create new Question
        const question = new Question({
            title: param.title,
            text: param.text,
            tags: tagIDs,
            answers: [],
            asked_by: param.asked_by,
            ask_date_time: new Date(),
            views: 0
        });

        await question.save();
        res.sendStatus(200);

    } catch (error) {
        console.error("Failed to save question", error);
    }
})
//Answer Post Request
app.post("/api/answers", async (req, res) => {
    try {
        const { text, ans_by, ans_date_time, questionID } = req.body;
        //Create new Answer
        const answer = new Answer({
            text: text,
            ans_by: ans_by,
            ans_date_time: ans_date_time,
        });
        //Save to answers collection
        await answer.save();

        //Retrieve ID
        const answerID = answer._id;

        //Push answerID to corresponding question answer's array
        const question = await Question.findById(questionID)
        question.answers.push(answerID);
        //Update question
        await question.save();

        const updatedQuestion = await Question.findById(questionID).populate("answers");
        //Sort by Newest
        const sortedAnswers = updatedQuestion.answers.sort((a, b) => {
            return (b.ans_date_time - a.ans_date_time);
        })

        updatedQuestion.answers = sortedAnswers;

        res.json(updatedQuestion);

    } catch (error) {
        console.error("Failed to save answer", error);
    }
})
//Tag Post Request
app.post("/api/tags", async (req, res) => {
    try {
        const { name } = req.body;
        //Create new tag
        const tag = new Tag({
            name: name
        });
        //Save to tags collection
        await tag.save();

        res.send(tag);

    } catch (error) {
        console.error("Failed to save tag", error);
    }
})
//Question Increment View Count Request
app.put("/api/questions/:id", async (req, res) => {
    const questionID = req.params.id;

    try {
        const question = await Question.findById(questionID);

        question.views += 1;

        await question.save();

        res.sendStatus(200);

    } catch (error) {
        console.error("Failed to update view count", error);
    }
})

//Question's Answers GET request
app.get("/api/questions/:id", async (req, res) => {
    const questionID = req.params.id;

    try {
        const question = await Question.findById(questionID)
            .populate("tags")
            .populate("answers");
        //Sort by Newest
        const sortedAnswers = question.answers.sort((a, b) => {
            return (b.ans_date_time - a.ans_date_time);
        })

        question.answers = sortedAnswers;

        res.json(question);
    } catch (error) {
        console.error("Failed to find question", error);
    }
});

//Users Get All Request
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Failed to fetch users", error);
    }
})

//Users Post Register Request
app.post("/api/users/", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //Verify that email does not already exist
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            res.send("User exists");
        }
        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        //Create new user
        const user = new User({
            username: username,
            email: email,
            password: hashedPass,
            role: "User",
            questions_asked: [],
            answers_posted: [],
            tags_created: [],
            reputation: 0,
            date_created: new Date(),
        })
        //Save user
        await user.save();
        res.send("User does not exist");

    } catch (error) {
        console.error("Failed to post user", error);
    }
})

//User Login
app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //Find User by Email
        const user = await User.findOne({ email });
        //Check if they exist
        if (!user) {
            res.send("User does not exist");
        }
        //Check password matches stored password
        const response = await bcrypt.compare(password, user.password);

        if (response) {
            //Create user session
            req.session.user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                questions_asked: user.questions_asked,
                answers_posted: user.answers_posted,
                tags_created: user.tags_created,
                reputation: user.reputation,
                date_created: user.date_created,
            };
            console.log(req.sessionID);
            res.json({
                success: true,
                message: "Login Success",
                sessionID: req.sessionID,
                username: user.username,
            });
        } else {
            res.json({
                success: false,
                message: "Failed to Login",
            });
        }

    } catch (error) {
        console.log("Failed to Login");
    }
})
//User Get Login
app.get("/api/users/login", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        console.error("Failed to fetch questions", error);
    };
})
// Handle Logout
app.post("/api/users/logout", async (req, res) => {
    try {
        //Clear session on server
        req.session.destroy();
        //Remove cookie from client
        res.clearCookie("sessionID");
        res.clearCookie("username");

        res.json({
            success: true,
            message: "Successfully Logged Out",
        });
    } catch (error) {
        console.log("Failed to log out");
    }
})
// Populate user Logout
app.get("/api/users/logout", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        console.error("Failed to fetch questions", error);
    };
})
// Get Profile Data
app.get("/api/users/profile", async (req, res) => {
    try {
        //Attempt to retrieve user info
        const sessionId = req.cookies.sessionID;
        //Attempt to retrieve username
        const username= req.cookies.username;
        //Check that both exist
        if (sessionId && username) {
            //Find user from username
            const user = await User.findOne({username});
            if (user) {
                res.json(user);
            } else {
                res.send("Failed to find user");
            }
        }
    } catch (error) {
        console.log("Failed to retrieve user info");
    }
})


////DELETE Requests //////////////////////////////////////
app.delete("/api/user", async (req, res) => {
    const { user_id } = req.body;
    try {
        const user_obj = await User.findById(user_id)
            .populate("questions")
            .populate("answers");

        //go thru every question that the user wrote
        for (let question of user_obj.questions_asked) {
            //go thru every answer in the question
            for (const answer of question.answers) {

                //go thru every comment in the current answer
                for (const comment of answer.comments) {
                    //delete the comment 
                    await Comment.deleteOne({ _id: comment._id });
                }

                //delete the answer
                await Answer.deleteOne({ _id: answer._id });
            }

            //go thru every comment in question and delete it
            for (const comment of question_obj.comments) {
                await Comment.deleteOne({ _id: comment._id });
            }

            //delete the question
            await Question.deleteOne({ _id: question._id });
        }

        await User.deleteOne({_id : user_id});
        
        //send response back that everything went well
        res.sendStatus(200);
    } catch (error) {
        console.error("User can not be deleted.");
    }
})

app.delete("/api/question", async (req, res) => {
    const { question_id } = req.body;

    try {
        let question_obj = await Question.findById(question_id)
            .populate("tags")
            .populate("answers")
            .populate("comments");

        //go thru every answer in the question
        for (const answer of question_obj.answers) {
            //go thru every comment in the current answer
            for (const comment of answer.comments) {
                //delete the comment 
                await Comment.deleteOne({ _id: comment._id });
            }

            //delete the answer
            await Answer.deleteOne({ _id: answer._id });
        }

        //go thru every comment in question and delete it
        for (const comment of question_obj.comments) {
            await Comment.deleteOne({ _id: comment._id });
        }

        //delete the user
        await Question.deleteOne({ _id: question_id });

        //send response back that everything went well
        res.sendStatus(200);
    } catch (error) {
        console.error("Failed to delete question", error);
    }

})

app.delete("/api/answers", async (req, res) => {
    const { ans_id } = req.body;

    try {
        const answer_obj = await Answer.findById(ans_id).populate("comments");

        //check if the answer exists
        if (answer_obj.length == 0) {
            throw new Exception("Can't find answer.");
        }

        //go thru each comment and delete it
        for (let comment of answer_obj.comments) {
            await Comment.deleteOne({ _id: comment._id });
        }

        //delete the answer from the collection
        await Answer.deleteOne({ _id: ans_id });

        //send response back that everything went well
        res.sendStatus(200);

    } catch (error) {
        console.error("Failed to delete answer", error);
    }
})


//Start Server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

//Connect to DB
try {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} catch (error) {
    console.error("Failed to connect");
}
//Current connection
const db = mongoose.connection;

db.on("error", (error) => {
    console.error("Failed to connect", (error));
})

//Handle termination of server and database
process.on("SIGINT", () => {
    db.close();
    console.log(" Server closed. Database instance disconnected.");
    process.exit(0);
})


