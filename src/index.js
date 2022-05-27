import './css/styles.css';
import ApiService from './api-service';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('.search-form'),
    pictureContainer: document.querySelector('.gallery'),
    lodaMoreButton: document.querySelector('.loadmore-button'),
};

const PictureApiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.lodaMoreButton.addEventListener('click', onLoadMore);


async function onSearch (event) {
    event.preventDefault();
    const userQuery = event.currentTarget.elements.query.value;
    PictureApiService.set(userQuery);
    refs.searchForm.reset();
    clearPicture();
    try {
        const fetchedQuery = await PictureApiService.fetchArticles();
         Loading.dots();
        Loading.remove(300);
        totalPictureInfo(fetchedQuery);
        renderPicture(fetchedQuery);
        createPictureGalery();
        loadButtonRender();
    }
    catch (error) {
        console.log(error);
    }
    
};

function renderPicture({ data }) {
    const pictureArray = data.hits;
    if (pictureArray.length === 0) {
        Report.failure(
'Query Failure',
'Sorry, there are no images matching your search query. <br/><br/>- Please try again.',
'Ok',
);
        return;
    }
    const markup = pictureArray
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
  <a href="${largeImageURL}"><img class="gallery-photo" src="${webformatURL}" alt="${tags}" loading="lazy" width="400" height="300"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-category">Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
        })
        .join('');
    refs.pictureContainer.insertAdjacentHTML('beforeend', markup);
}
    
function loadButtonRender() {
    refs.lodaMoreButton.classList.remove('is-hidden');
};

async function onLoadMore() {
    const loadMoreQuery = await PictureApiService.fetchArticles();
     Loading.dots();
    Loading.remove(400);
    renderPicture(loadMoreQuery);
    loadButtonRender();
    createPictureGalery();
};

function clearPicture() {
    refs.pictureContainer.innerHTML= ''; 
};

function createPictureGalery() {
 const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
 });
    lightbox.refresh();
};

function totalPictureInfo({data}) {
    const totalHits = data.totalHits;
    Report.success(
'Hooray!',
`We found ${totalHits} images.`,
'Ok',
);
}