const formEl = document.forms["search-form"];

// console.dir(document);
console.log(formEl);

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

fetch(BASE_URL, options).then(r => r.json()).then(console.log).catch(console.log)

}