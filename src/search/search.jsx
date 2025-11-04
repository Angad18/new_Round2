import { useState } from 'react';
import mag_glass2 from '/src/assets/mag_glass2.png';
import axios from 'axios'

function Search() {

    const [movie, setMovie] = useState(''); // React hook - state variable used since state is changing.
    const [result, setResult] = useState(null);
    const api_url = import.meta.env.VITE_API_URL;
    const api_key = import.meta.env.VITE_API_KEY;

    // async function so that slow processes like getting information from API can happen simultaneously while carrying on other functions

    // promise in JS acts as a placeholder (like in Search input) - also signifies completion or failure of an async operation
        
    // use await to let other processes continue as it is, while data is being received - alternative is .then()
    

    async function handleChange(e) {
        // console.log("Changed.");

        const input = e.target.value; // accessing value of target. target is one of the many properties received on doing an action like pressing enter.
        // console.log(input);

        setMovie(input); // update state
    }

    async function handleEnter(e) {
        if (e.key === 'Enter') {
            
            // axios is a JS library
            const res = await axios.get(`${api_url}?s=${movie}&apikey=${api_key}`); // s gives partial searches, t gives exact searches

            // receives response and then assigns value accordingly to result
            if (res.data.Response === 'False') {
                setResult([]); // plain text won't work since setResult is assigned a JS object
            } else {
                // we use Search according to the format of the returned JSON data
                setResult(res.data.Search); // array of movie objects
            }
        }        
    }

    const [chosenMovie, setchosenMovie] = useState(null); // state variable since data to be modified further
    
    async function title_click(imdbID) {
        const result = await axios.get(`${api_url}?i=${imdbID}&apikey=${api_key}`);

        // Response is again according to JSON data
        if (result.data.Response === "True") {
            setchosenMovie(result.data);
        }

    }
    

    return <div>
        <div className='search_bar'>
            <img src={mag_glass2} className='mag_img'/>

            {/* value={movie} being done to assign the value of this input field as 'movie' */}
            <div className="search">
                <input 
                value={movie}
                onChange={handleChange}
                onKeyDown={handleEnter}
                type='text'
                placeholder={'Search and press enter'}
                className='search_input'/> 
            </div>
        </div>

        <p className='content'>
            {result && result.length > 0 ? (
                <div id='info'>
                    {result.map((movieItem, index) => ( // map used to loop over all elements of the array
                        <div key={index} className='movie_list'>
                            <h2> <button onClick={() => title_click(movieItem.imdbID)} id="title"> {movieItem.Title} </button> </h2>
                            {/* <h3> {movieItem.Year} </h3>
                            <h3> {movieItem.Genre} </h3>
                            <h3> {movieItem.Actors} </h3>
                            <img src={movieItem.Poster}/> */}
                            
                        </div>
                    ))}
                </div>
                ) : ( <h3> No results </h3>) }

                <div className='details'>
                    {chosenMovie && (
                        <div>
                            <h2> {chosenMovie.Title} </h2>
                            <h3> {chosenMovie.Year} </h3>
                            <h3> {chosenMovie.Genre} </h3>
                            <h3> {chosenMovie.Actors} </h3>
                            <img src={chosenMovie.Poster}/>
                        </div>
                    )}
                </div>
        </p>

    </div>

    // Returned JSON Data example:

    /* On entering (movie) = "Batman"
    {
    "Search": [
        {
        "Title": "Batman Begins",
        "Year": "2005",
        "imdbID": "tt0372784",
        "Type": "movie",
        "Poster": "https://..."
        },
        {
        "Title": "Batman v Superman: Dawn of Justice",
        "Year": "2016",
        "imdbID": "tt2975590",
        "Type": "movie",
        "Poster": "https://..."
        }
    ],
    "totalResults": "2",
    "Response": "True"
    } 
    */
    
}

export default Search;