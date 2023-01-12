// variables
const formElement = document.querySelector('form');
const inputElement = document.querySelector('input#date-input');
const articleElement = document.querySelector('.article-content');
const dateButtonElement = document.querySelector('.date-button');
const modalElement = document.querySelector('.modal');

// Create an app object (whenYouWereBorn)
const whenYouWereBornApp = {};

// Initialize preset data in the dedicated properties
// - nytApiKey
whenYouWereBornApp.nytApiKey = '3PVudwxw0pTrDaU6BjIwRtu6a64QHvKB';
// - unsplashAccessKey
whenYouWereBornApp.unsplashAccessKey = 'e92v_aFnnoM-PnNGYNUNCSJTCQKlukw0-1t06E0pW8U';
// - userQuery
whenYouWereBornApp.userQuery = '';
// - articlesArray
whenYouWereBornApp.articlesArray = [];
// - currentArticle
whenYouWereBornApp.currentArticleIndex = 0;

// addListeners function
whenYouWereBornApp.addListeners = () => {
  dateButtonElement.addEventListener('click', () => {
    modalElement.classList.add('active');
    setTimeout(() => {
      document.querySelector('.article-content').innerHTML = '';
    }, 1000);
  });
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    whenYouWereBornApp.getUserQuery();
    whenYouWereBornApp.getArticles(whenYouWereBornApp.userQuery);
    setTimeout(() => {
      modalElement.classList.remove('active');
    }, 500);
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
    'api-key': whenYouWereBornApp.nytApiKey,
    fq: `pub_date:(${date})`,
  });
  fetch(url)
    .then((response) => {
      // When the API call is successful
      return response.json();
    })
    .then((jsonResult) => {
      // If article includes all the required data
      const curatedArticlesArray = whenYouWereBornApp.curatedArticles(jsonResult.response.docs);
      if (curatedArticlesArray.length === 0) {
        throw new Error("You were born before the time of news")
      }
      whenYouWereBornApp.articlesArray = [...shuffleArray(curatedArticlesArray)];
      console.log(whenYouWereBornApp.articlesArray);
      // Call displayArticle method
      whenYouWereBornApp.displayArticle(whenYouWereBornApp.currentArticleIndex);
    })
    .catch((err) => {
      // If the API call fails, display an error message
      console.log(err);
    });
};

whenYouWereBornApp.getUnsplashImage = async (keywords, headline) => {
  const unsplashUrl = new URL('https://api.unsplash.com/search/photos/');
  unsplashUrl.search = new URLSearchParams({
    client_id: whenYouWereBornApp.unsplashAccessKey,
    query: keywords.length !== 0 ? keywords.map((e) => e.value).join(' ') : headline,
  });
  console.log(keywords.map((e) => e.value).join(' '));

  const res = await fetch(unsplashUrl);
  const data = await res.json();
  console.log(data);
  const url = data.results[0].urls.regular;
  const imgElement = document.querySelector('.article-image-container img');
  imgElement.src = url;
  imgElement.alt = `placeholder image for '${headline}' article`;
}

// displayArticle function
whenYouWereBornApp.displayArticle = (index) => {
  const currentArticle = whenYouWereBornApp.articlesArray[index];
  const {
    pub_date: pubDate,
    headline: { main: headline },
    section_name: sectionName,
    byline: { original: byline },
    abstract,
    keywords,
  } = currentArticle;

  const multimedia = currentArticle.multimedia;
  const imgAltText = `image from '${headline}' article`;
  let imgSrcText = getSrcText(multimedia);

  function getSrcText() {
    // if multimedia is available, use it
    if (multimedia[0]) {
      return 'https://static01.nyt.com/' + multimedia[0].url;
    } else {
      // else, get image from unsplash API using keyword(s) as query
      return whenYouWereBornApp.getUnsplashImage(keywords, headline);
    }
  }

  const dateElement = document.createElement('div');
  dateElement.classList.add('date');
  dateElement.textContent = dateString(pubDate);

  const imageContainerElement = document.createElement('div');
  imageContainerElement.classList.add('article-image-container');
  const imageElement = document.createElement('img');
  imageElement.src = imgSrcText;
  imageElement.alt = imgAltText;
  imageContainerElement.append(imageElement);

  // headline
  const headlineElement = document.createElement('h2');
  headlineElement.classList.add('headline');
  headlineElement.textContent = headline;

  // section name
  const sectionNameElement = document.createElement('h3');
  sectionNameElement.classList.add('section-name');
  sectionNameElement.textContent = sectionName;

  // byline
  const bylineElement = document.createElement('div');
  bylineElement.classList.add('byline');
  bylineElement.textContent = byline;

  // abstract
  const abstractElement = document.createElement('div');
  abstractElement.classList.add('abstract');
  abstractElement.textContent = abstract;

  // add elements to .article-content
  const articleContentElement = document.querySelector('.article-content');
  articleContentElement.innerHTML = '';
  articleContentElement.append(dateElement);
  articleContentElement.append(imageContainerElement);
  articleContentElement.append(sectionNameElement);
  articleContentElement.append(headlineElement);
  articleContentElement.append(bylineElement);
  articleContentElement.append(abstractElement);
};

// filter for quality articles
whenYouWereBornApp.curatedArticles = (articleArray) => {
  console.log(articleArray)
  console.log(articleArray.filter(article => article.abstract.length > 50).filter(article => article.byline.original))
  return articleArray
    // abstract string length
    .filter(article => article.abstract.length > 50)
    // presence of byline and all fields that we are using
    .filter(article => article.byline.original)
    // filter out obituary and archive pieces
    .filter(article => article.type_of_material !== 'Obituary')
    // remove 'LEAD' in abstract
    .map(article => {
      const copy = { ...article }
      if (copy.abstract.startsWith('LEAD: ')) {
        copy.abstract = copy.abstract.slice(6);
      }
      return copy;
    })
};

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
}

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
