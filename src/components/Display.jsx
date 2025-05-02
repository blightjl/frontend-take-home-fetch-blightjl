import { useEffect, useState } from 'react';
import AvailableBreeds from './AvailableBreeds';
import '../styles/display.css';

const ITEMS_PER_PAGE = 25;

const Display = () => {
    const [searchString, setSearchString] = useState('');
    const [ascendingOrder, setAscendingOrder] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [previousPageQuery, setPreviousPageQuery] = useState('');
    const [nextPageQuery, setNextPageQuery] = useState('');

    const [total, setTotal] = useState(0);

    const [breeds, setBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);

    const [dogs, setDogs] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const params = new URLSearchParams();

    const fetchPageData = async () => {
        setLoading(true);

        selectedBreeds.forEach(selectedBreed => {
            params.append('breeds', selectedBreed);
        });

        const breedQueryString = params.toString();

        let searchQuery = "";
        const from = (currentPage - 1) * ITEMS_PER_PAGE;

        let sorting = ascendingOrder ? `sort=breed:asc` : `sort=breed:desc`;

        searchQuery += '?';
        searchQuery += selectedBreeds ? breedQueryString + '&' : "";
        searchQuery += `size=${ITEMS_PER_PAGE}&from=${from}&${sorting}`;

        console.log("fetchPageData()");
        console.log(searchQuery);


        try {
            const dogsResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search${searchQuery}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!dogsResponse.ok) {
                throw new Error('Error fetching dogs!');
            }

            const dogsData = await dogsResponse.json();
            setTotal(dogsData.total);
            console.log('dogsData.resultIds');
            console.log(dogsData.resultIds);

            const dogObjectsResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs${searchQuery}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dogsData.resultIds)
            });

            const dogsObjectData = await dogObjectsResponse.json();
            setDogs(dogsObjectData);

            // setDogs(dogsData.resultIds);
            if ('prev' in dogsData) {
                setPreviousPageQuery(dogsData.prev);
            }
            if ('next' in dogsData) {
                setNextPageQuery(dogsData.next);
            }
        } catch (err) {
            setErrorMessage('Error: ', err.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            try {
                // fetch all available breeds
                const breedsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!breedsResponse.ok) {
                    throw new Error('Error fetching breeds!');
                }

                const dogBreedsData = await breedsResponse.json();
                setBreeds(dogBreedsData);

            } catch (err) {
                setErrorMessage('Error: ', err.message);
            }

            try {
                // fetch all available dogs
                const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/search', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!dogsResponse.ok) {
                    throw new Error('Error fetching dogs!');
                }

                const dogsData = await dogsResponse.json();
                setTotal(dogsData.total);
                setDogs(dogsData.resultIds);
                if ('prev' in dogsData) {
                    setPreviousPageQuery(dogsData.prev);
                }
                if ('next' in dogsData) {
                    setNextPageQuery(dogsData.next);
                }

            } catch (err) {
                setErrorMessage('Error: ', err.message);
            }

            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        console.log("currentPage", currentPage);
        console.log("ascendingOrder", ascendingOrder);
        fetchPageData();
    }, [currentPage, ascendingOrder]);

    useEffect(() => {
        console.log(searchString);
    }, [searchString]);

    const clearSelected = () => {
        setSelectedBreeds([]);
    }

    if (loading) return <h3>Loading dogs...</h3>;
    if (errorMessage) return <h3>{errorMessage}</h3>;

    return (
        <div>
            {/* search bar & search params */}
            <div className="form-field">
                {/* search */}
                <button onClick={fetchPageData}>GO</button>

                {/* sort bar */}
                <label htmlFor="order">Sort order</label>
                <select name="order" id="order" onChange={(e) => setAscendingOrder(e.target.value === "true")} value={String(ascendingOrder)}>
                    <option value="true">Ascending</option>
                    <option value="false">Descending</option>
                </select>
            </div>
            {/* display content */}
            <div className="layout-container"><div className="left-panel">
                <div className="breed-select">
                    <AvailableBreeds breeds={breeds} selectedBreeds={selectedBreeds} onSelectionChange={setSelectedBreeds} clearSelections={clearSelected} />
                </div>
            </div>
                <div className="right-panel">
                    <h3>Dogs</h3>
                    {dogs.length > 0 ? (
                        <div>
                            <div className='grid-container'>
                                {dogs.map(dog => (
                                    // <li key={dog.id}>{dog}</li>
                                    <div className="dog-card" key={dog.id}>
                                        <h3>Name: {dog.name}</h3>
                                        <img className="dog-icon" src={dog.img} />
                                        <span>Age: {dog.age}</span>
                                        <span>Zipcode: {dog.zip_code}</span>
                                        <span>Breed: {dog.breed}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
                            <span>
                                <select name="page" id="page" onChange={(e) => setCurrentPage(Number(e.target.value))} value={currentPage}>
                                    {Array.from({ length: Math.ceil(total / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                                / {Math.ceil(total / ITEMS_PER_PAGE)}</span>
                            <button onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(total / ITEMS_PER_PAGE)))} disabled={currentPage === Math.ceil(total / ITEMS_PER_PAGE)}>Next</button>
                        </div>
                    ) : (
                        <p>No dogs found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Display;