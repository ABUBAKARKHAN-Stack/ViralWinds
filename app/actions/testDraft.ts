'use server'

import { adminClient } from "@/sanity/lib/admin-client"

const LANDING_PAGE_CONTENT_ID = 'landingPageContent'

export async function testDraftSaveLoad() {
    console.log('\n=== TESTING DRAFT SAVE/LOAD ===')

    // Step 1: Save a test draft
    console.log('Step 1: Saving test draft...')
    const testData = {
        _type: 'landingPageContent',
        _id: `drafts.${LANDING_PAGE_CONTENT_ID}`,
        hero: {
            badge: {
                en: 'TEST DRAFT ' + new Date().toISOString(),
                ur: 'TEST',
                es: 'TEST',
                ar: 'TEST'
            }
        }
    }

    try {
        const result = await adminClient.createOrReplace(testData)
        console.log('✅ Draft saved successfully')
        console.log('Save result:', result)
    } catch (error) {
        console.error('❌ Failed to save draft:', error)
        return { success: false, error: 'Failed to save' }
    }

    // Step 2: Try different fetch methods
    console.log('\nStep 2: Fetching draft with different methods...')

    // Method 1: GROQ query
    console.log('\nMethod 1: GROQ query')
    try {
        const query = `*[_id == "drafts.${LANDING_PAGE_CONTENT_ID}"][0]`
        console.log('Query:', query)
        const draft1 = await adminClient.fetch(query)
        console.log('Result:', draft1 ? '✅ Found' : '❌ Not found')
        if (draft1) console.log('Data:', draft1.hero?.badge?.en)
    } catch (error) {
        console.error('Error:', error)
    }

    // Method 2: getDocument
    console.log('\nMethod 2: getDocument')
    try {
        const draft2 = await adminClient.getDocument(`drafts.${LANDING_PAGE_CONTENT_ID}`)
        console.log('Result:', draft2 ? '✅ Found' : '❌ Not found')
        if (draft2) console.log('Data:', draft2.hero?.badge?.en)

        return { success: true, draft: draft2, method: 'getDocument' }
    } catch (error) {
        console.error('Error:', error)
    }

    // Method 3: List all drafts
    console.log('\nMethod 3: List all documents with "drafts." prefix')
    try {
        const allDrafts = await adminClient.fetch(`*[_id match "drafts.*"]`)
        console.log('Total drafts found:', allDrafts?.length || 0)
        if (allDrafts && allDrafts.length > 0) {
            console.log('Draft IDs:', allDrafts.map((d: any) => d._id))
        }
    } catch (error) {
        console.error('Error:', error)
    }

    return { success: false, error: 'Could not fetch draft with any method' }
}
