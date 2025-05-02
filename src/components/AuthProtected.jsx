import { useEffect, useState } from 'react';

export default function AuthProtected({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // check client-side storage for whether the client has been authenticated or not
        const storedAuthState = localStorage.getItem('isAuthenticated') === 'true';

        console.log("storedAuthState", storedAuthState);
        console.log("localStorage.getItem('isAuthenticated')", localStorage.getItem('isAuthenticated'));

        if (!storedAuthState) {
            // redirect if not authenticated
            window.location.href = '/login';
            return;
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }

        // verify the authentication status by making a request
        // fetch('https://frontend-take-home-service.fetch.com/dogs/breed', {
        //     credentials: 'include'
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             // server indicates not authenticated
        //             localStorage.removeItem('isAuthenticated');
        //             window.location.href = '/login';
        //             return
        //         }
        //         setIsAuthenticated(true);
        //     })
        //     .catch(() => {
        //         // error checking assuming not authenticated
        //         localStorage.removeItem('isAuthenticated');
        //         window.location.href = '/login';
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });

    }, []);

    if (isLoading) {
        return <div className="loading">Verifying authentication...</div>
    }

    return isAuthenticated ? children : null;
}