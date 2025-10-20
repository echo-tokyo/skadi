import axios, { AxiosInstance } from 'axios'

export const createAxiosInstance = (config?: {
  baseURL?: string
  timeout?: number
}): AxiosInstance => {
  return axios.create({
    baseURL: config?.baseURL || import.meta.env.VITE_API_BASE_URL,
    timeout: config?.timeout || 10000,
    withCredentials: true,
  })
}
