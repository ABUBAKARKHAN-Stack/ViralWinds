// "use client"

// import LoadingScreen from '@/components/LoadingScreen'
// import { AnimatePresence } from 'motion/react'
import {  ReactNode} from 'react'

type Props = {
    children: ReactNode
}

const PublicProvider: FC<Props> = ({
    children
}) => {
    // const [isLoading, setIsLoading] = useState(true);

    return children
        
            {/* <AnimatePresence mode="wait">
                {isLoading && (
                    <LoadingScreen onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence> */}
            {/* {!isLoading && (
                <> */}
                    
               {/* / */}
        
    
}

export default PublicProvider