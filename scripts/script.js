// variables
const apiURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const apiKey = '3PVudwxw0pTrDaU6BjIwRtu6a64QHvKB';

const formElement = document.querySelector('form');
const inputElement = document.querySelector('input#date-input');
const articleElement = document.querySelector('.article-content');

// Create an app object (whenYouWereBorn)
const whenYouWereBornApp = {};

// Initialize preset data in the dedicated properties
// - apiURL
whenYouWereBornApp.apiURL = new URL(apiURL);
// - apiKey
whenYouWereBornApp.apiKey = apiKey;
// - userQuery
whenYouWereBornApp.userQuery = '';
// - articlesArray
whenYouWereBornApp.articlesArray = [];
// - currentArticle
whenYouWereBornApp.currentArticleIndex = 0;

// addListensers function
whenYouWereBornApp.addListeners = () => {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    whenYouWereBornApp.getUserQuery();
    whenYouWereBornApp.getArticles(whenYouWereBornApp.userQuery);
  });
};

// Create a method (getUserQuery) to update the variable (userQuery) based on user input
whenYouWereBornApp.getUserQuery = () => {
  whenYouWereBornApp.userQuery = inputElement.value;
};

// Create a method (getArticles) to make API calls, which takes the user input as a parameter (userQuery)
whenYouWereBornApp.getArticles = (date) => {
  const url = new URL(whenYouWereBornApp.apiURL);
  url.search = new URLSearchParams({
    'api-key': whenYouWereBornApp.apiKey,
    fq: `pub_date:(${date})`,
  });
  fetch(url)
    .then((response) => {
      // When the API call is successful
      return response.json();
    })
    .then((jsonResult) => {
      // If article includes all the required data
      whenYouWereBornApp.articlesArray = [...shuffleArray(jsonResult.response.docs)];
      console.log(whenYouWereBornApp.articlesArray);
      // Call displayArticle method
      whenYouWereBornApp.displayArticle(whenYouWereBornApp.currentArticleIndex);
    })
    .catch((err) => {
      // If the API call fails, display an error message
      console.log(err);
    });
};

// displayArticle function
whenYouWereBornApp.displayArticle = (index) => {
  const currentArticle = whenYouWereBornApp.articlesArray[index];
  const headline = currentArticle.headline.main;
  console.log(index, currentArticle);
  articleElement.innerHTML = `
  <div class="date">${currentArticle.pub_date.slice(0, 10)}</div>
  <div>
    <img src="${currentArticle.multimedia[0] ? 'https://static01.nyt.com/' + currentArticle.multimedia[0].url : ''}" alt="" />
  </div>
  <h2>${headline}</h2>
  <h3>${currentArticle.section_name}</h3>
  <div class="byline">${currentArticle.byline.original}</div>
  <div class="abstract">${currentArticle.abstract}</div>
  `;
};

// filter for quality articles

whenYouWereBornApp.filterArticle = () => {
  // abstract string length
  // presence of byline and all fields that we are using
}

// Create an init method to kick off the setup of the application
whenYouWereBornApp.init = () => {
  whenYouWereBornApp.addListeners();
};

whenYouWereBornApp.init();

// helper functions

// shuffleArray Function
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
