export interface LoginUserDto {
    userName: string | null;
    password: string | null;
}

export interface UserDto {
    id: number | null;
    userName: string | null;
    email: string | null;
    role: string | null;
    token: string | null;
}

export interface UserResponse {
    lstData: UserDto[];
    rowsCount: number;
}