import { BASE_URL } from "@/modules/shared/utils/config"
import { User } from "@/modules/user/types/auth"

export const getUsers = async (filter: object) => {
    try {
        console.log(`Users Requested`, filter);

        const response = await fetch(`${BASE_URL}api/v1/users`, {
            method: 'GET'
        });

        console.log(response);

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUser = async (id: string, data: object) => {
    try {
        console.log(`User update request for user: ${id}`, data);
        const response = await fetch(`${BASE_URL}api/v1/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        console.log(response);
        const resData = await response.json();
        console.log(resData);
        return resData;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteUser = async (id: string) => {
    try {
        console.log(`User delete request for id: ${id}`);
        const response = await fetch(`${BASE_URL}api/v1/users/${id}`, {
            method: 'DELETE'
        });
        console.log(response);
        const resData = await response.json();
        console.log(resData);
        return resData;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
