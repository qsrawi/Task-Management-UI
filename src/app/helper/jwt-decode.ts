import { jwtDecode } from 'jwt-decode';

export function decodeToken(type: 'Role' | 'Id'): any {
    const token = localStorage.getItem('authToken');
    if (token != null) {
        const decodedToken: any = jwtDecode(token);
        if (type == 'Role')
            return decodedToken.role;
        else
            return decodedToken.nameid;
    }
}