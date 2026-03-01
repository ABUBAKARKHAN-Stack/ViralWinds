import { APP_NAME } from '@/constants/app.constants'
import { cn } from '@/lib/utils'

const HighlightedBrandname = ({ className = "" }) => {
    return (
        <span className='relative w-fit inline-block  px-0.5 py-px'>

            <span className={
                cn(
                    'font-extrabold tracking-wider text-foreground/90 ',
                    className
                )
            }>{APP_NAME}</span>
            <span className='absolute inset-0 -z-10 bg-muted rounded-md block' />
          
        </span>
    )
}

export default HighlightedBrandname