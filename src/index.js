import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.forms["search-form"];
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// console.dir(document);
// console.log(formEl);
loadMoreBtn.style.display = 'none';
// console.dir(loadMoreBtn.style.display);

class FetchImages{
    constructor(){
        // this.path = path;
        this.page = 1;
        this.perPage = 40;
        this.query = '';
        // this.url = `https://pixabay.com/api/?key=29142435-196ab0ea47673651fa34d9a29&q=${query}s&image_type=photo&per_page=40&orientation=horizontal&safesearch=true`
    }

    // set path(newPath){
    //     this.path = newPath
    // }
    // get path(){
    //     return this.path
    // }

    setQuery(newQuery){
        this.query = newQuery
    }

    setNextPage(){
        this.page += 1;
    }

    // set page(newPage){
    //     this.page = newPage
    // }
    // get page(){
    //     return this.page
    // }

    // set query(newQuery){
    //     this.perPage = newQuery
    // }
    // get query(){
    //     return this.query
    // }

    getData(){
        const url = `https://pixabay.com/api/?key=29142435-196ab0ea47673651fa34d9a29&q=${this.query}s&image_type=photo&per_page=${this.perPage}&page=${this.page}&orientation=horizontal&safesearch=true`
        console.log('url', url);
        
        return axios.get(url)
        .then(res => res.data)        
    }
}


let gallery = new SimpleLightbox('.gallery a', {
	captions: true,
	captionSelector: 'img',
	captionType: 'attr',
	captionsData: 'alt',
	captionPosition: 'bottom',
	captionDelay: 250,
	});

const newFetchImages = new FetchImages()

formEl.addEventListener('submit', onFOrmSubmit)
loadMoreBtn.addEventListener('click', onloadMoreClick)

function onFOrmSubmit(evt){
    evt.preventDefault();
    const searchQuery = evt.currentTarget.searchQuery.value
    console.log(searchQuery);

    clearGallery();
    
    // fetchImages(searchQuery).then(renderGallery).catch( Notify.failure)
    newFetchImages.setQuery(searchQuery);
    newFetchImages.getData().then(renderGallery).catch( Notify.failure);

}

function onloadMoreClick(){
    newFetchImages.setNextPage()
    newFetchImages.getData().then(renderGallery).catch( Notify.failure)
}




function fetchImages(query) {
// const API_KEY = "29142435-196ab0ea47673651fa34d9a29";
// const BASE_URL = "https://pixabay.com/api/";
// const options = {
//     headers: {
//     'Content-Type': 'application/json',
//     key: API_KEY,

//     },
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
// }

const url = `https://pixabay.com/api/?key=29142435-196ab0ea47673651fa34d9a29&q=${query}s&image_type=photo&per_page=40&orientation=horizontal&safesearch=true`
return axios.get(url)
.then(res => res.data)
}

function renderGallery(data){

    if(!data)return
    const {hits, totalHits} = data;
    console.log(hits);
    Notify.success(`Hooay! We found ${totalHits} images.`);
    const imagesMarkup = hits
    .reduce((markUp,hit) => markUp + createCardMarkup(hit), '')

    galleryEl.insertAdjacentHTML('beforeend', imagesMarkup)
    gallery.refresh()
    loadMoreBtn.style.display = '';
   
    
}

function createCardMarkup(data) {
const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = data;

const cardMarkup = `
    <li class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class = "gallery__image" />
            
            <ul class="info">
                <li class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
                </li>
                <li class="info-item">
                <b>Views</b>
                <span>${views}</span>
                </li>
                <li class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
                </li>
                <li class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
                </li>
            </ul>
        </a>
    </li>`
return cardMarkup; 
}

function clearGallery() {
    galleryEl.innerHTML = '';
}

