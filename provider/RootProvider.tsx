"use client"
import { Toaster } from '@/components/ui/sonner'
import { FC, ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const RootProvider: FC<Props> = ({
    children
}) => {


    return (
        <>
            <Toaster />
            {children}
        </>
    )
}

export default RootProvider