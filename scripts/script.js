// variables
const formElement = document.querySelector('form');
const inputElement = document.querySelector('input#date-input');
const articleElement = document.querySelector('.article-content');

// Create an app object (whenYouWereBorn)
const whenYouWereBornApp = {};

// Initialize preset data in the dedicated properties
// - apiKey
whenYouWereBornApp.apiKey = '3PVudwxw0pTrDaU6BjIwRtu6a64QHvKB';
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
  const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json');
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

  const dateElement = document.createElement('div');
  dateElement.classList.add('date');
  // TO-DO: DISPLAY DATE IN PROPER FORMAT
  // dateElement.textContent = currentArticle.pub_date.slice(0, 10);
  dateElement.textContent = dateString(currentArticle.pub_date);

  const imageContainerElement = document.createElement('div');
  const imageElement = document.createElement('img');
  imageElement.src = currentArticle.multimedia[0] ? 'https://static01.nyt.com/' + currentArticle.multimedia[0].url : '';
  imageElement.alt = `image for '${currentArticle.headline.main}' article`;
  imageContainerElement.append(imageElement);

  // headline
  const headlineElement = document.createElement('h2');
  headlineElement.textContent = currentArticle.headline.main;

  // section name
  const sectionNameElement = document.createElement('h3');
  sectionNameElement.textContent = currentArticle.section_name;

  // byline
  const bylineElement = document.createElement('div');
  bylineElement.classList.add('byline');
  bylineElement.textContent = currentArticle.byline.original;

  // abstract
  const abstractElement = document.createElement('div');
  abstractElement.classList.add('abstract');
  abstractElement.textContent = currentArticle.abstract;

  // add elements to .article-content
  const articleContentElement = document.querySelector('.article-content');
  articleContentElement.innerHTML = '';
  articleContentElement.append(dateElement);
  articleContentElement.append(imageContainerElement);
  articleContentElement.append(headlineElement);
  articleContentElement.append(sectionNameElement);
  articleContentElement.append(bylineElement);
  articleContentElement.append(abstractElement);
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

function dateString(date) {
  const newDate = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  let result = newDate.toLocaleDateString('en-US', options);
  return result;
}
