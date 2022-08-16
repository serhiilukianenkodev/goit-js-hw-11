import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import {FetchImages} from './js/fetchImages'

const formEl = document.forms["search-form"];
const galleryEl = document.querySelector('.gallery');
const loading = document.querySelector('.loading');

let gallery = new SimpleLightbox('.gallery a', {
	captions: true,
	captionSelector: 'img',
	captionType: 'attr',
	captionsData: 'alt',
	captionPosition: 'bottom',
	captionDelay: 250,
	});

const fetchImages = new FetchImages()

formEl.addEventListener('submit', onFOrmSubmit)

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        infiniteLoad(); 
    }
}, {
    rootMargin: '100px',
    threshold: 1.0,
});

function onFOrmSubmit(evt){
    evt.preventDefault();
    const searchQuery = evt.currentTarget.searchQuery.value

    clearGallery();
    
    fetchImages.setQuery(searchQuery);
    fetchImages.getData()
        .then(data => {
            logMessage(data);
            renderGallery(data)})
        .catch(e => Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
}

function logMessage(data){
    const {hits, totalHits} = data;
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
    smoothScrool()
    //
    const lastCard = galleryEl.lastElementChild.querySelector('.gallery__image');
    if (lastCard && !isAllLoad(data)) infiniteObserver.observe(lastCard)

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

function smoothScrool(){
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

function infiniteLoad() {
    loading.classList.add('show');
    fetchImages.setNextPage();
    fetchImages.getData()
        .then(data => { 
            if (isAllLoad(data)) {
                Notify.failure("We're sorry, but you've reached the end of search results.")
                observer.unobserve() 
            }
            renderGallery(data)})
        .catch(e => {
            // Notify.failure("Sorry. Something going wrong:(")
            loading.classList.remove('show');
        })
}

function isAllLoad(data) {
    const amount = (fetchImages.getCurrentPage() - 1) * fetchImages.getPerPageAmount() + data.hits.length;
            return (amount >= data.totalHits) 
}
