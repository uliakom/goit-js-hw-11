export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    async fetchArticles() {
        const MY_KEY = '8682108-caaa83b2d6a66c1f39bba0100';
        const URL = `https://pixabay.com/api/?key=${MY_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${this.page}`;
        const axios = require('axios');
        const picture = await axios.get(URL);
        this.incrementPage();
        console.log(picture);
        return picture;
    }
    
    get () {
        return this.searchQuery;
    }
     set (newQuery) {
        this.searchQuery= newQuery;
    }

    incrementPage() {
        this.page += 1;
    }
    }
