// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

//node init.js <email_of_admin> <password_of_admin>
let userArgs = process.argv.slice(2);

if (userArgs[0] == null || userArgs[1] == null) {
  console.log("Missing admin/password argument(s)");
  return;
}

let adminEmail = userArgs[0];
let adminPass = userArgs[1];


let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')
let Comment = require('./models/comments');

let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function tagCreate(name, created_by) {
  let tag = new Tag({ 
    name: name,
    created_by: created_by,
  });
  return tag.save();
}

function answerCreate(text, ans_by, comments, ans_date_time, upvotes, downvotes) {
  answerdetail = {
    text: text,
    comments: comments,
    upvotes: upvotes,
    downvotes: downvotes,
  };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, summary, text, tags, comments, answers, asked_by, ask_date_time, views, upvotes, downvotes) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    comments: comments,
    tags: tags,
    asked_by: asked_by,
    upvotes: upvotes,
    downvotes: downvotes,
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function adminCreate(email, password) {
    adminDetail = {
      username: "Admin",
      email: email,
      password: password,
      role: "Admin",
      questions_asked: [],
      answers_posted: [],
      tags_created: [],
      reputation: 50,
      date_created: new Date(),
    };
    let admin = new User(adminDetail);
    return admin.save();
}

function userCreate(username, email, password, role, questions_asked, answers_posted, tags_created, reputation, date_created) {
  userDetail = {
    username: username,
    email: email,
    password: password,
    role: role,
    questions_asked: questions_asked,
    answers_posted: answers_posted,
    tags_created: tags_created,
    reputation: reputation,
    date_created: date_created,
  };
  let user = new User(userDetail);
  return user.save();
}

function commentCreate(commenter, text, votes) {
  commentDetail = {
    commenter: commenter,
    text: text,
    votes: votes,
  };
  let comment = new Comment(commentDetail);
  return comment.save();
}

const populate = async () => {
  //User creation
  let admin = await adminCreate(adminEmail, adminPass);
  let user1 = await userCreate("Joji John", "jojijohn@email.com", "jojijohn", "User", [], [], [], 0, new Date());
  let user2 = await userCreate("saltyPeter", "saltyPeter@email.com", "saltyPeter", "User", [], [], [], 0, new Date());
  let user3 = await userCreate("hamkalo", "hamkalo@email.com", "hamkalo", "User", [], [], [], 0, new Date());
  let user4 = await userCreate("azad", "azad@email.com", "azad","User", [], [], [], 0, new Date());
  let user5 = await userCreate("abaya", "abaya@email.com", "abaya", "User", [], [], [], 0, new Date());
  let user6 = await userCreate("alia", "alia@email.com", "alia", "User", [], [], [], 0, new Date());
  let user7 = await userCreate("sana", "sana@email.com", "sana", "User", [], [], [], 0, new Date());
  //Comment Creation
  let c1 = await commentCreate(user1, "Comment from Joji John", 0);
  let c2 = await commentCreate(user2, "Comment from saltyPeter.", 0);
  let c3 = await commentCreate(user3, "Comment from hamkalo.", 0);
  //Tag Creation
  let t1 = await tagCreate('react', [user1]);
  let t2 = await tagCreate('javascript', [user1, user2]);
  let t3 = await tagCreate('android-studio', [user2]);
  let t4 = await tagCreate('shared-preferences', [user2]);
  //Answer Creation
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', user3, [c1, c2], false);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', user4, [c1, c2, c3], false);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', user5, [c1] ,false);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', user6, [c2], false);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', user7, [c2, c3], false);
  //Question Creation
  let q1 = await questionCreate(
    'Programmatically navigate using React router', 
    "Q1 summary",
    'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', 
    [t1, t2], 
    [c1, c2, c3],
    [a1, a2], 
    user1, 
    false, 
    false);
  let q2 = await questionCreate('android studio shared preference', 
  "Q2 Summary",
  'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', 
  [t3, t4, t2], 
  [c1, c2],
  [a3, a4, a5], 
  user2, 
  false, 
  121);
  //Update any associated fields
  await User.updateOne(
    {_id: user1._id}, 
    {$push: 
      {questions_asked: q1, 
      tags_created: [t1, t2], 
      }
    }
  );
  await User.updateOne(
    {_id: user2._id}, 
    {$push: 
      {questions_asked: q2, 
      tags_created: [t2, t3], 
      }
    }
  );
  await User.updateOne(
    {_id: user3._id}, 
    {$push: 
      {answers_posted: a1}
    }
  );
  await User.updateOne(
    {_id: user4._id}, 
    {$push: 
      {answers_posted: a2}
    }
  );
  await User.updateOne(
    {_id: user5._id}, 
    {$push: 
      {answers_posted: a3}
    }
  );
  await User.updateOne(
    {_id: user6._id}, 
    {$push: 
      {answers_posted: a4}
    }
  );
  await User.updateOne(
    {_id: user7._id}, 
    {$push: 
      {answers_posted: a5}
    }
  );

  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
