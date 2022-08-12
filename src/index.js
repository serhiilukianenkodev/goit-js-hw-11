
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';

import {FetchImages} from './js/fetchImages'

const formEl = document.forms["search-form"];
const galleryEl = document.querySelector('.gallery');
const loading = document.querySelector('.loading');
// const loadMoreBtn = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.gallery a', {
	captions: true,
	captionSelector: 'img',
	captionType: 'attr',
	captionsData: 'alt',
	captionPosition: 'bottom',
	captionDelay: 250,
	});

// hideEl(loadMoreBtn);
const fetchImages = new FetchImages()

formEl.addEventListener('submit', onFOrmSubmit)
// loadMoreBtn.addEventListener('click', onloadMoreClick)
const throttledLoadMore = throttle(loadMore, 1000)

function onFOrmSubmit(evt){
    evt.preventDefault();
    // hideEl(loadMoreBtn);
    const searchQuery = evt.currentTarget.searchQuery.value

    clearGallery();
    
    fetchImages.setQuery(searchQuery);
    fetchImages.getData()
    .then(data => {

        logMessage(data);
        return renderGallery(data)})
    .catch(e => Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
    
    window.addEventListener('scroll', throttledLoadMore)
}

// function onloadMoreClick(){
//     fetchImages.setNextPage()
//     fetchImages.getData().then(renderGallery).catch(e => Notify.failure("We're sorry, but you've reached the end of search results."))
// }

function logMessage(data){
        const {hits, totalHits} = data;
    // console.log(hits);
    if( hits.length === 0) {throw new Error()}
    Notify.success(`Hooay! We found ${totalHits} images.`);
}

function renderGallery(data){

    const {hits} = data;
    const imagesMarkup = hits
    .reduce((markUp,hit) => markUp + createCardMarkup(hit), '')

    loading.classList.remove('show');
    galleryEl.insertAdjacentHTML('beforeend', imagesMarkup)
    gallery.refresh()
    // showEl(loadMoreBtn);
    smoothScrool()
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

// function showEl(elem) {
//     elem.style.display = '';
// }

// function hideEl(elem) {
//     elem.style.display = 'none';
// }

function smoothScrool(){
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

function loadMore(){
    const galleryHeight = galleryEl.offsetHeight;

    // const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	// console.log( { scrollTop, scrollHeight, clientHeight });
    // const need = clientHeight + scrollTop >= scrollHeight - 5;
    // console.log(need);
    //
    
    const needToDownload = (galleryHeight - scrollY < innerHeight * 2)
    // console.log(needToDownload);

    if (needToDownload) {
        loading.classList.add('show');
        fetchImages.setNextPage()
        fetchImages.getData().then(renderGallery)
        .catch(e => {
            Notify.failure("We're sorry, but you've reached the end of search results.")
            window.removeEventListener('scroll', throttledLoadMore)
            loading.classList.remove('show');
        })
            

    }
}
