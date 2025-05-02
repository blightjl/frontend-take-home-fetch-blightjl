import { useEffect, useState } from 'react';
import '../styles/selectable.css';

const AvailableBreeds = ({ breeds, selectedBreeds, onSelectionChange, clearSelections }) => {
    const [selected, setSelected] = useState(selectedBreeds);


    const toggleSelect = (option) => {
        if (selected.includes(option)) {
            onSelectionChange(selected.filter(id => id !== option));
            setSelected((prev) => prev.filter((o) => o !== option));
        } else {
            onSelectionChange([...selected, option]);
            setSelected((prev) => [...prev, option]);
        }
    };

    useEffect(() => {
        console.log("CHILD: ");
        console.log(selected);
    }, [selected]);

    const clearSelected = () => {
        setSelected([]);
        clearSelections();
    }

    return (
        <div>
            <button onClick={clearSelected}>CLEAR</button>
            <div className="list">
                {breeds.map(breed => (
                    <div
                        key={breed}
                        className={`card ${selected.includes(breed) ? 'selected' : ''}`}
                        onClick={() => { toggleSelect(breed); }}>
                        {breed}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailableBreeds;