import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export function getSortedPostsData() {
    // Get file names under /posts
    // const fileNames = fs.readdirSync(postsDirectory)
    const fileNames = fs.readdirSync(path.join(process.cwd(), 'posts'))
    // console.log(fileNames);
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        // const id = fileName.replace(/\.md$/, '')
        const id = fileName.replace(/\.md$/, '')
        // console.log(id);
        // Read markdown file as string
        // const fullPath = path.join(postsDirectory, fileName)
        const fullPath = path.join(process.cwd(), 'posts', fileName)
        // console.log(fullPath);
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        // console.log(fileContents);
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)
        // console.log(matterResult);
        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        }
    })
    // console.log(allPostsData);
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        // if (a.date < b.date) {
        //     return 1
        // } else {
        //     return -1
        // }
        return a.date < b.date ? 1 : -1
    })
}


const postsDirectory = path.join(process.cwd(), 'posts')

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}