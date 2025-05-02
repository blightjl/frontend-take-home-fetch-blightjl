import { useState, useEffect } from 'react';
import AvailableBreeds from './AvailableBreeds';
import '../styles/display.css';

const TempBreedFetcher = () => {

    const [breeds, setBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);

    useEffect(() => {
        const getBreeds = async () => {
            try {
                const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('An error occurred while fetching breeds.');
                }

                const breedData = await response.json();

                setBreeds(breedData);
                console.log(breedData);
            } catch (err) {

            }
        }
        getBreeds();
    }, []);

    useEffect(() => {
        console.log("FROM THE PARENT:");
        console.log(selectedBreeds);
    }, [selectedBreeds]);

    const clearSelected = () => {
        setSelectedBreeds([]);
    }

    return (
        <div className="breed-select">
            {/* <button onClick={clearSelected}>CLEAR</button> */}
            <AvailableBreeds breeds={breeds} selectedBreeds={selectedBreeds} onSelectionChange={setSelectedBreeds} clearSelections={clearSelected} />
        </div>
    );
}

export default TempBreedFetcher;