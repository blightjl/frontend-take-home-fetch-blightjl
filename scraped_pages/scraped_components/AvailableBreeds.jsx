import { useState } from 'react';
import '../styles/selectable.css';

const AvailableBreeds = ({ breeds, onSelectionChange }) => {
    const [selected, setSelected] = useState([]);

    // const handleBreedClick = (breedId) => {
    //     if (selectedBreeds.includes(breedId)) {
    //         onSelectionChange(selectedBreeds.filter(id => id !== breedId));
    //     } else {
    //         onSelectionChagne([...selectedBreeds, breedId]);
    //     }
    // };

    const toggleSelect = (option) => {
        console.log("toggleSelect(option) called!");
        setSelected((prev) =>
            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]);
    };

    return (
        <div className="card-container">
            {breeds.map(breed => (
                <div
                    key={breed}
                    className={`card ${selected.includes(breed)} ? 'selected' : ''`}
                    onClick={() => { toggleSelect(option); }}></div> //handleBreedClick(option) 
            ))}
        </div>
    );
}

export default AvailableBreeds;