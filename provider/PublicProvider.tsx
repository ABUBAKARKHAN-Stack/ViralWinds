"use client"

import LoadingScreen from '@/components/LoadingScreen'
import { AnimatePresence } from 'motion/react'
import { FC, ReactNode, useState } from 'react'

type Props = {
    children: ReactNode
}

const PublicProvider: FC<Props> = ({
    children
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>
            {!isLoading && (
                <>
                    {children}
                </>
            )}
        </>
    )
}

export default PublicProvider