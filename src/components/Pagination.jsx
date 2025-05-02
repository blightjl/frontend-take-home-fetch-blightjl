import React, { useState } from 'react';

export default function Pagination({ items, itemsPerPage, fromServer = false }) {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(items.length / itemsPerPage);

    const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (fromServer) {
        return (
            <div>
                <ul>
                    {currentItems.map(item => (
                        <li key={item.id}>{item}</li>
                    ))}
                </ul>
                <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
                <span>
                    <select name="page" id="page" onChange={(e) => setCurrentPage(e.target.value)} value={currentPage}>
                        {Array.from({ length: maxPage }, (_, i) => i + 1).map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                    / {maxPage}</span>
                <button onClick={() => setCurrentPage(Math.min(currentPage + 1, maxPage))} disabled={currentPage === maxPage}>Next</button>
            </div>
        );
    }

    return (
        <div>
            <ul>
                {currentItems.map(item => (
                    <li key={item.id}>{item}</li>
                ))}
            </ul>
            <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
            <span>
                <select name="page" id="page" onChange={(e) => setCurrentPage(e.target.value)} value={currentPage}>
                    {Array.from({ length: maxPage }, (_, i) => i + 1).map(i => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                / {maxPage}</span>
            <button onClick={() => setCurrentPage(Math.min(currentPage + 1, maxPage))} disabled={currentPage === maxPage}>Next</button>
        </div>
    );
};
