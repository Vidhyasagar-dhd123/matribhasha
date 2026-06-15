import { BASE_URL } from "@/modules/shared/utils/config"
import { getRequestHeaders } from "@/modules/shared/utils/request"

export const getUsers = async (filter: { search?: string; page?: number; limit?: number; sort?: string } = {}) => {
    try {
        const params = new URLSearchParams()

        if (filter.search) params.set("search", filter.search)
        if (filter.page) params.set("page", String(filter.page))
        if (filter.limit) params.set("limit", String(filter.limit))
        if (filter.sort) params.set("sort", filter.sort)

        const response = await fetch(`${BASE_URL}api/v1/users${params.toString() ? `?${params.toString()}` : ""}`, {
            method: 'GET',
            headers: getRequestHeaders(false)
        });

        return await response.json();
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
            headers: getRequestHeaders(),
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
            method: 'DELETE',
            headers: getRequestHeaders(false)
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

export const toggleBlockUser = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}api/v1/users/${id}/block`, {
            method: 'POST',
            headers: getRequestHeaders(false),
        });

        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
