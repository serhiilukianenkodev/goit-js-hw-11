import axios from "axios";

export class FetchImages{
    constructor(){
        this.page = 1;
        this.perPage = 40;
        this.query = '';
    }

    setQuery(newQuery){
        this.query = newQuery;
        this.page = 1;
    }

    setNextPage(){
        this.page += 1;
    }


    async getData(){
        const BASE_URL = 'https://pixabay.com/api/'
        const key = '29142435-196ab0ea47673651fa34d9a29'
        const url = `${BASE_URL}?key=${key}&q=${this.query}s&image_type=photo&per_page=${this.perPage}&page=${this.page}&orientation=horizontal&safesearch=true`
        // console.log('url', url);
        
        const res = await axios.get(url);
        const data = await res.data;
        return data;    


        // return axios.get(url)
        // .then(res => {
        //     console.log('res.data', res.data);
        //     return res.data
        // })        
    }
}
