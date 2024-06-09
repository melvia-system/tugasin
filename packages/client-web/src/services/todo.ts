export namespace Api {
    // api: return value of BaseApi()
    export const parseUrl = (api: ReturnType<BaseApi>) => {
        const BASE_URL = (import.meta.env ? import.meta.env?.PUBLIC_BASE_URL : process.env?.PUBLIC_BASE_URL)  || ''
        return `${BASE_URL}${api.url}`
    }
    export const Fetch = async <T = undefined>(api: ReturnType<BaseApi>) => {
        const url = parseUrl(api)
        const response = await fetch(url, {
            method: api.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: api.data ? JSON.stringify(api.data) : undefined
        });
        // extends T to BaseResponse<T>
        return await response.json() as BaseResponse<T> 
    }

    // schema
    export type BaseApi = (...args: any[]) => {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: object;
    }
    export interface BaseResponse<T = undefined> {
        success: boolean
        message: string
        data: T
    }
    export namespace Schema {
        export namespace Todo {
            export interface Project {
                id: number
                name: string
            }
            export interface Item {
                id: number
                name: string
                done: boolean
            }
            export interface Group {
                id: number
                name: string
                todoItems: Item[]
            }
        }
    }

    // api
    export namespace Todo {
        export namespace Project {
            export const List: BaseApi = () => ({
                url: '/project'
            })
            export const Create: BaseApi = () => ({
                url: '/project',
                method: 'POST'
            })
        }
        export namespace Group {
            export const List: BaseApi = (projectId: number) => ({
                url: `/project/${projectId}/group`
            })
            export const Create: BaseApi = (projectId: number, data: object) => ({
                url: `/project/${projectId}/group`,
                method: 'POST',
                data
            })
        }
        export namespace Item {
            export const Create: BaseApi = (projectId: number, groupId: number, data: object) => ({
                url: `/project/${projectId}/group/${groupId}/todo`,
                method: 'POST',
                data,
            })
            export const Update: BaseApi = (projectId: number, groupId: number, itemId: number, data: object) => ({
                url: `/project/${projectId}/group/${groupId}/todo/${itemId}`,
                method: 'PUT',
                data,
            })
        }
    }
}