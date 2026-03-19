import { useEffect, useRef } from 'react'

export const useAbortController = () => {
    const controllerRef = useRef<AbortController | null>(null)

    const abort = () => {
        if (controllerRef.current) {
            controllerRef.current.abort()
            controllerRef.current = null
        }
    }

    const getSignal = () => {
        abort()

        controllerRef.current = new AbortController()
        return controllerRef.current.signal
    }

    useEffect(
        () => () => {
            abort()
        },
        [],
    )

    return {
        getSignal,
        abort,
        controller: controllerRef.current,
    }
}
