export function checkIsAuthenticated() {
    return localStorage.getItem() === 'true';
}

export function markAuthenticated() {
    localStorage.set('isAuthenticated', isAuthenticated ? 'true' : 'false');

}

export function markFirstVisit() {
    localStorage.setItem('isFirstDashboardVisit', isFirst ? 'true' : 'false');
}

export function isFirstDashboardVisit() {
    return localStorage.getItem('isFirstDashboardVisit') === 'true';
}

export async function verifyAuthWithServer() {
    try {
        const response = await fetch('/auth/verify', {
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.error('Auth verification error:', error);
        return false;
    }
}

export async function logout() {
    try {
        const resposne = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('isFirstDashboardVisit');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}