export default function LogoutButton() {
    const handleLogout = async () => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
                method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('isFirstDashboardVisit');

            if (response.ok) {
                // clear client-side authentication state
                // redirect to home
                window.location.href = '/login';
            }
            else {
                console.log(response);
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="logout-button">
            Log Out
        </button>
    );
}