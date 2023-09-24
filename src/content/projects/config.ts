// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';


const projectCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    link: z.string().url(),
    desc: z.string(),
    liveLink: z.string().url().optional(),
  })
})

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'projects': projectCollection,
  
};