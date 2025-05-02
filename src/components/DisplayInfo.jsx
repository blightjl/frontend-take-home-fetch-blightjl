import { useEffect, useState } from 'react';
import Pagination from './Pagination';

const ORDER = Object.freeze({
    ASC: 'ASCENDING',
    DESC: 'DESCENDING'
});

export default function DisplayInfo() {
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [displayBreeds, setDisplayBreeds] = useState([]);
    const [displayOrder, setDisplayOrder] = useState(ORDER.ASC);

    const [availableDogs, setAvailableDogs] = useState([]);
    const [totalDogIds, setTotalDogIds] = useState(0);
    const [dogPage, setDogPage] = useState(1);
    const [previousPage, setPreviousPage] = useState('');
    const [nextPage, setNextPage] = useState('');



    // fetch dog breeds
    useEffect(() => {
        const isFirstDashboardVisit = localStorage.getItem('isFirstDashboardVisit') === 'true';

        setIsFirstVisit(true);
        setLoading(true);
        const fetchData = async () => {
            setIsFirstVisit(true);
            setLoading(true);

            try {
                const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dog breeds');
                }

                const breedData = await response.json();
                setBreeds(breedData);

                const sortedBreeds = sortByOrder(breedData, displayOrder);
                setDisplayBreeds(sortedBreeds);

                // localStorage.setItem('isFirstDashboardVisit', 'false');

                const params = new URLSearchParams();
                sortedBreeds.forEach(breed => params.append('breeds', breed));
                const queryString = params.toString();
                console.log(queryString);
                const url = queryString
                    ? `https://frontend-take-home-service.fetch.com/dogs/search?${queryString}&size=10`
                    : 'https://frontend-take-home-service.fetch.com/dogs/search?size=10';

                const dogResponse = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                });

                const dogIDs = await dogResponse.json();

                setTotalDogIds(dogIDs.total);

                console.log(dogIDs.resultIds);

                if (!dogResponse.ok) {
                    throw new Error('Failed to fetch dogs');
                }

                setAvailableDogs(dogIDs.resultIds);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const sortedBreeds = sortByOrder([...displayBreeds], displayOrder);
        setDisplayBreeds(sortedBreeds);
    }, [displayOrder]);

    useEffect(async () => {
        // make request again
        try {
            const response = await fetch('', {

            });
        } catch (err) {

        }
    }, [dogPage]);

    function filterBreeds() {
        if (!searchString.trim()) {
            const sortedBreeds = sortByOrder([...breeds], displayOrder);
            setDisplayBreeds(sortedBreeds);
            return;
        }
        // console.log("THE SEARCH PARAMETER: ", searchString);
        // console.log("displayBreeds");
        // console.log(displayBreeds);
        // displayBreeds.map(breed => console.log(typeof breed));
        const filteredBreeds = breeds.filter((breed) => breed.toLowerCase().includes(searchString.toLowerCase()));
        // console.log("newDisplayBreeds");
        // console.log(newDisplayBreeds);

        const sortedFilteredBreeds = sortByOrder(filteredBreeds, displayOrder);
        setDisplayBreeds(sortedFilteredBreeds);
    }

    function sortByOrder(breedsArray, order) {
        const newArray = [...breedsArray];
        switch (order) {
            case ORDER.ASC:
                return newArray.sort(); // return newArray.sort((a, b) => a.localCompare(b));
            case ORDER.DESC:
                return newArray.sort().reverse();
            default:
                return newArray;
        }
    }

    const setSortOrder = (e) => {
        if (Object.values(ORDER).includes(e.target.value)) {
            setDisplayOrder(e.target.value);
        }
    };

    if (!isFirstVisit) return null;

    if (loading) return <div className="loading">Loading dog breeds...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="first-visit-content">
            <h2>Welcome to Your First Visit!</h2>
            <div className="form-field">
                <label htmlFor="searchString">Search</label>
                <input
                    id="searchString"
                    type="text"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            filterBreeds();
                        }
                    }}
                    required
                />
                <button onClick={filterBreeds}>GO</button>
                <label htmlFor="order">Sort order</label>
                <select name="order" id="order" onChange={setSortOrder} value={displayOrder}>
                    <option value={ORDER.ASC}>Ascending</option>
                    <option value={ORDER.DESC}>Descending</option>
                </select>
            </div>
            <div className="dog-breeds-container">
                <h3>Dogs ({availableDogs.length})</h3>
                {availableDogs.length > 0 ? (
                    <div>
                        <ul>
                            {availableDogs.map(item => (
                                <li key={item.id}>{item}</li>
                            ))}
                        </ul>
                        <button onClick={() => setCurrentPage(Math.max(dogPage - 1, 1))} disabled={dogPage === 1}>Previous</button>
                        <span>
                            <select name="page" id="page" onChange={(e) => setDogPage(e.target.value)} value={dogPage}>
                                {Array.from({ length: Math.ceil(totalDogIds / 10) }, (_, i) => i + 1).map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                            / {Math.ceil(totalDogIds / 10)}</span>
                        <button onClick={() => setCurrentPage(Math.min(dogPage + 1, Math.ceil(totalDogIds / 10)))} disabled={currentPage === Math.ceil(totalDogIds / 10)}>Next</button>
                    </div>
                ) : (
                    <p>No dogs found.</p>
                )}
            </div>
            <div className="dog-breeds-container">
                <h3>Dog breeds ({displayBreeds.length})</h3>
                {displayBreeds.length > 0 ? (
                    <>
                        <Pagination items={displayBreeds} itemsPerPage={10} />
                    </>
                ) : (
                    <p>No dog breeds found.</p>
                )}
            </div>
        </div>
    );
}