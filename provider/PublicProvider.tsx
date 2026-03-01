"use client"

import CustomCursor from '@/components/CustomCursor'
import LoadingScreen from '@/components/LoadingScreen'
import { AnimatePresence } from 'motion/react'
import { FC, ReactNode, useEffect, useState } from 'react'
import './public.css'

type Props = {
    children: ReactNode
}

const PublicProvider: FC<Props> = ({
    children
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {mounted && <CustomCursor />}
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