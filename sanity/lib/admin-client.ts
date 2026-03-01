import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import { token } from './token'

export const adminClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false, // Mutation must use fresh data
})
