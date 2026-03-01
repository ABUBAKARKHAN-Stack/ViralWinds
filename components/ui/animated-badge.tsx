import  { ReactNode } from 'react'
import { BorderBeam } from './border-beam'
import { cn } from '@/lib/utils'

const AnimatedBadge = ({ children,className  ="" }: { children: ReactNode,className?:string }) => {
    return (
        <div className={cn(
            "flex relative items-center gap-2.5 px-4 py-2.5 rounded-full bg-accent/10",
            className
        )}>
            {children}
            <BorderBeam
                className="from-accent/60 via-accent to-transparent"
                duration={6}
                size={50}
            />
        </div>
    )
}

export default AnimatedBadge