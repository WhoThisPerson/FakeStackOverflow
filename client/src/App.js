// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import React from "react";
import WelcomePage from './components/Pages/WelcomePage';
import RegisterUserPage from './components/Pages/RegisterUserPage';
import LoginUserPage from './components/Pages/LoginUserPage';
import Header from './components/Header';
import SideBar from './components/SideBar';
import HomePage from "./components/Pages/HomePage";
import AskQuestionPage from "./components/Pages/AskQuestionPage";
import TagsPage from "./components/Pages/TagsPage";
import TagsResults from "./components/Pages/TagResults";
import SearchResultsPage from "./components/Pages/SearchResultsPage";
import QuestionContentPage from "./components/Pages/QuestionContentPage";
import PostAnswerPage from "./components/Pages/PostAnswerPage";
import UserProfilePage from './components/Pages/UserProfilePage';

export default class App extends React.Component {
      
  constructor(props) {
    super(props);

    this.state = {
      currentPage: "",
      currentMainPage: "WelcomePage",
      parameters: null,
    };
  }

  //newPage is the page destination 
  //newCurrentMainPage is to display sidebar when needed 
    //put "HomePage" for any pages outside of Welcome
  //newParameters is for the values being brought to the newPage
  navigate = (newPage, newCurrentMainPage, newParameters) => {
    this.setState({
      currentPage: newPage,
      currentMainPage: newCurrentMainPage,
      parameters: newParameters,
    });
  };

  //function to decide what page on HomePage to display
  currentPageContent() {
    const { currentPage, parameters } = this.state;

    switch(currentPage) {
      case "Home":
        return <HomePage navigate={this.navigate} parameters={parameters}/>
      case "AskQuestion":
        return <AskQuestionPage navigate={this.navigate} />
      case "Tags":
        return <TagsPage navigate={this.navigate} />
      case "TagResults":
        return <TagsResults navigate={this.navigate} parameters={parameters} />
      case "SearchResults":
        return <SearchResultsPage navigate={this.navigate} parameters={parameters} />;
      case "QuestionContentPage":
        return <QuestionContentPage navigate={this.navigate} parameters={parameters} />
      case "PostAnswerPage":
        return <PostAnswerPage navigate={this.navigate} parameters={parameters} />;
      case "UserProfile":
        return <UserProfilePage navigate={this.navigate} parameters={parameters} />
      case "":
        return;
      default:
        throw new Error("Page not found");
    };
  }
  //Function to change the main page
  currentMainPageContent() {
    const { currentMainPage, parameters } = this.state;

    switch (currentMainPage) {
      case "WelcomePage":
        return <WelcomePage navigate={this.navigate} parameters={parameters}/>
        
      case "RegisterUser":
        return <RegisterUserPage navigate={this.navigate} parameters={parameters} />
  
      case "LoginUser":
        return <LoginUserPage navigate={this.navigate} parameters={parameters} />
      
      case "HomePage":
        return "";
      default:
        return <WelcomePage navigate={this.navigate} parameters={parameters}/>
    }
  }

  render() {
    return(
      <>
        <Header navigate={this.navigate} />
        <div className='main'>
          {this.state.currentMainPage === "HomePage" && <SideBar currentPage={this.state.currentPage} navigate={this.navigate}/>}
          <div className='right-margin'>
              <div>
                {this.currentMainPageContent()}
              </div>
              {this.state.currentMainPage === "HomePage" && this.currentPageContent()}
          </div>
        </div>
      </>
    )
  }
}


