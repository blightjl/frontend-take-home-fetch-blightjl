import { useState } from 'react';

export default function LoginForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
                credentials: 'include',
            });

            if (response.ok) {
                // use localStorage to set flags
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('isFirstDashboardVisit', 'true');

                // redirect
                window.location.href = '/dashboard';
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    );
}
