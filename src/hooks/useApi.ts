import { useState } from 'react'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAbortController } from './useAbortController'

const isAbortError = (err: unknown): err is DOMException =>
    err instanceof DOMException && err.name === 'AbortError'

type ApiArgs<TParams extends unknown[]> = {
    params?: TParams
    config?: AxiosRequestConfig
}

export type UseApiReturn<T, TParams extends unknown[]> = {
    data: T | null
    isLoading: boolean
    error: unknown
    request: (args?: ApiArgs<TParams>) => Promise<T>
    abort: () => void
    reset: () => void
}

type EndpointFunction<T, TParams extends unknown[]> = (
    ...args: [...TParams, AxiosRequestConfig?]
) => Promise<AxiosResponse<T>>

export const useApi = <T, TParams extends unknown[] = []>(
    endpoint: EndpointFunction<T, TParams>,
): UseApiReturn<T, TParams> => {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)
    const { getSignal, abort } = useAbortController()

    const request = async (args?: ApiArgs<TParams>): Promise<T> => {
        setIsLoading(true)
        setError(null)

        const params = (args?.params || []) as TParams
        const finalConfig: AxiosRequestConfig = {
            ...args?.config,
            signal: getSignal(),
        }

        try {
            const response = await (endpoint as (...args: unknown[]) => Promise<AxiosResponse<T>>)(
                ...params,
                finalConfig,
            )
            setData(response.data)
            return response.data
        } catch (err: unknown) {
            if (!isAbortError(err)) setError(err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const reset = () => {
        abort()
        setData(null)
        setError(null)
        setIsLoading(false)
    }

    return { data, isLoading, error, request, abort, reset }
}
