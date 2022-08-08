import axios from "axios";

const formEl = document.forms["search-form"];
const galleryEl =document.querySelector('.gallery')

// console.dir(document);
// console.log(formEl);

formEl.addEventListener('submit', onFOrmSubmit)

function onFOrmSubmit(evt){
    evt.preventDefault();
    const searchQuery = evt.currentTarget.searchQuery.value
    console.log(searchQuery);

    fetchImages(searchQuery)
}



function fetchImages(query) {
const API_KEY = "29142435-196ab0ea47673651fa34d9a29";
const BASE_URL = "https://pixabay.com/api/";
const options = {
    headers: {
    'Content-Type': 'application/json',
    key: API_KEY,

    },
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
}

const url = `https://pixabay.com/api/?key=29142435-196ab0ea47673651fa34d9a29&q=${query}s&image_type=photo&per_page=40`
return axios.get(url)
.then(res => res.data.hits[0].webformatURL)
.then(url => {
    console.log('url', url);
    const imgMarkup = `<li><img src="${url}" alt="img"></li>`
    console.log('imgMarkup', imgMarkup);
    galleryEl.insertAdjacentHTML('beforeend', imgMarkup)
}).catch(console.log)
// fetch(BASE_URL, options).then(r => r.json()).then(console.log).catch(console.log)

// fetch(`https://pixabay.com/api/?key=29142435-196ab0ea47673651fa34d9a29&q=${query}s&image_type=photo`).then(r => r.json()).then(console.log).catch(console.log)



}