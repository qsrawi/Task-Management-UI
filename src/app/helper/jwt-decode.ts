import { jwtDecode } from 'jwt-decode';

export function decodeToken(): any {
    const token = localStorage.getItem('authToken');
    if (token != null) {
        const decodedToken: any = jwtDecode(token);

        return decodedToken.role;
    }
}