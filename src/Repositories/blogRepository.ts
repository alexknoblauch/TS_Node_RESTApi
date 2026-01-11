/**
 * Types
 */
import Blog, { IBlog, QueryType } from "@/models/blog"
import { UserResponse } from "./userRepository";
import getOrSetRedis from "@/utils/getOrSetRedis";
import { redisClient } from "@/lib/redis";

export type SortOptions = Record<string, 1 | -1>;


export type BlogResponse = {
    id: string;                    
    title: string;
    content: string;
    banner: IBlog['banner'];
    author: UserResponse;          // Autor als Objekt, nicht nur ID
    createdAt: Date;
    updatedAt: Date;
    viewsCount?: number;
    likesCount?: number;
    commentsCount?: number;
}
type BlogResponseNoAuthor = Omit<BlogResponse, 'author'>

//Factroy Pattern (representiert Klasse in funktion)
export const createBlogRepository = () => {
    return {

        create: async(data: any): Promise<BlogResponse> => {
            const createdBlog = await Blog.create(data)
            if(!createdBlog){
                throw new Error(`Create User failed`)
            }
            const blogWithAuthor = await Blog.findById(createdBlog._id).populate('author').lean().exec() 

            if(!blogWithAuthor){
                throw new Error(`Population failed`)
            }

            //author Type checken (muss Obj sein mongoose) / Danach author erstellen
            if (!blogWithAuthor.author || typeof blogWithAuthor.author === 'string') {
                throw new Error('Author not populated');
            }
            const author = blogWithAuthor.author as any;

            return {
                id: blogWithAuthor._id.toString(),            
                title: blogWithAuthor.title,
                content: blogWithAuthor.content,
                banner: blogWithAuthor.banner,
                author: {                                   // ganzes Obj !!
                    id: author._id.toString(),
                    userName: author.userName,
                    email: author.email,
                    role: author.role,
                    firstName: author.firstName,
                    lastName: author.lastName
                },
                createdAt: blogWithAuthor.createdAt,
                updatedAt: blogWithAuthor.updatedAt,
                viewsCount: blogWithAuthor.viewsCount,
                likesCount: blogWithAuthor.likesCount,
                commentsCount: blogWithAuthor.commentsCount
            }
        },

        
        // Populate Problem: Type missmatch bei foreignkeys - string / Types.ObjectId
        getBlogById: async(id: string):Promise<BlogResponse> => {
            const cacheKey = `Blog:${id}`

            return await getOrSetRedis<BlogResponse>(cacheKey, async() => {
                const blog = await Blog.findById(id).populate('author').lean().exec()

                if(!blog) {
                    throw new Error(`No Blog found, id:${blog}`)
                }


                //author Type checken (muss Obj sein mongoose) / Danach author erstellen
                if (!blog.author || typeof blog.author === 'string') {
                    throw new Error('Author not populated');
                }
                const author = blog.author as any;


                return {
                    id: blog._id.toString(),            
                    title: blog.title,
                    content: blog.content,
                    banner: blog.banner,
                    author: {                                   // ganzes Obj !!
                        id: author._id.toString(),
                        userName: author.userName,
                        email: author.email,
                        role: author.role,
                        firstName: author.firstName,
                        lastName: author.lastName
                    },
                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                    viewsCount: blog.viewsCount,
                    likesCount: blog.likesCount,
                    commentsCount: blog.commentsCount
                } 
            })
        },



        getAllBlogs: async(userId: string, query: QueryType, limit: number, skip: number, select: string = '-__v -banner.publicId', sort?: string):Promise<BlogResponse[]> => {
            const cacheKey = `blogs:${userId}:${JSON.stringify(query)}:${limit}:${skip}:${select}:${sort}`

            return await getOrSetRedis<BlogResponse[]>(cacheKey, async() => {

                //sort() bruacht OBJ ! {desc: -1}. Hier string zu OBJ umwandeln:
                const sortOptions: Record<string, 1 | -1> = sort === 'popular' 
                ? { viewsCount: -1 as -1 } 
                : { createdAt: -1 as -1 };


                const blogs = await Blog.find(query).populate('author')            
                    .select(select)
                    .limit(limit)
                    .skip(skip)
                    .sort(sortOptions)
                    .lean()
                    .exec()

            
                if(!blogs || blogs.length === 0) return [];


                return blogs.map(blog => {
                    //author Type checken (muss Obj sein mongoose) / Danach author erstellen
                    if (!blog.author || typeof blog.author === 'string') {
                        throw new Error('Author not populated');
                    }
                    const author = blog.author as any;


                    return {
                        id: blog._id.toString(),            
                        title: blog.title,
                        content: blog.content,
                        banner: blog.banner,
                        author: {                                   // ganzes Obj !!
                            id: author._id.toString(),
                            userName: author.userName,
                            email: author.email,
                            role: author.role,
                            firstName: author.firstName,
                            lastName: author.lastName
                        },
                        createdAt: blog.createdAt,
                        updatedAt: blog.updatedAt,
                        viewsCount: blog.viewsCount,
                        likesCount: blog.likesCount,
                        commentsCount: blog.commentsCount
                    } 
                })
            })
        },

        getBlogBySlug: async (slug: string):Promise<BlogResponse> => {
            const cacheKey =  `Blog:slug:${slug}`;

            return await getOrSetRedis<BlogResponse>(cacheKey, async() => {
                const doc = await Blog.findOne({ slug }).populate('author').lean().exec()

                if(!doc) {
                    throw new Error(`No Blog found, slug:${slug}`)
                }


                //author Type checken (muss Obj sein mongoose) / Danach author erstellen
                if (!doc.author || typeof doc.author === 'string') {
                    throw new Error('Author not populated');
                }
                const author = doc.author as any;


                return {
                    id: doc._id.toString(),            
                    title: doc.title,
                    content: doc.content,
                    banner: doc.banner,
                    author: {                                   // ganzes Obj !!
                        id: author._id.toString(),
                        userName: author.userName,
                        email: author.email,
                        role: author.role,
                        firstName: author.firstName,
                        lastName: author.lastName
                    },
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    viewsCount: doc.viewsCount,
                    likesCount: doc.likesCount,
                    commentsCount: doc.commentsCount
                } 
            })
        },

        getBlogsByUser: async(user: string):Promise<BlogResponse[]> => {                //array
            const cacheKey = `Blogs:user:${user.toString()}`

            return await getOrSetRedis<BlogResponse[]>(cacheKey, async() => {           //array
                const blogs = await Blog.find({ author: user }).populate('author').lean().exec()

                if(!blogs) {
                    throw new Error(`No Blogs found, user:${user}`)
                }

                return blogs.map(blog => {                                              // return !!
                    if (!blog.author || typeof blog.author === 'string') {
                        throw new Error('Author not populated');
                    }
                    const author = blog.author as any;

                    return {
                        id: blog._id.toString(),            
                        title: blog.title,
                        content: blog.content,
                        banner: blog.banner,
                        author: {                                   // ganzes Obj !!
                            id: author._id.toString(),
                            userName: author.userName,
                            email: author.email,
                            role: author.role,
                            firstName: author.firstName,
                            lastName: author.lastName
                        },
                        createdAt: blog.createdAt,
                        updatedAt: blog.updatedAt,
                        viewsCount: blog.viewsCount,
                        likesCount: blog.likesCount,
                        commentsCount: blog.commentsCount
                    }
                })
            })
        },   

        deleteBlog: async(id: string):Promise<void> => {                
            const blog = await Blog.findById(id).populate('author').lean().exec()

            if(!blog) {
                throw new Error(`No Blog found, blog:${blog}`)
            }

            //REDIS
            const keysToDelete: string[] = [
                `Blog:${id}`, 
            ];
            
            if (blog.slug) {
                keysToDelete.push(`Blog:slug:${blog.slug}`);
            }
            
            await Promise.all(keysToDelete.map(key => redisClient.del(key)));
            

            //Blogs:user:123 - blog id herausfiltern
            const cachedBlogs = await redisClient.get(`Blogs:user:${blog.author.toString()}`);      //foreignKey: ID
            if (cachedBlogs) {
                const blogs = JSON.parse(cachedBlogs);
                const updatedBlogs = blogs.filter((b:any) => b.id !== id);
                
                await redisClient.set(
                    `Blogs:user:${blog.author.toString()}`,                 //foreignKey: ID
                    JSON.stringify(updatedBlogs)
                );
            }

            await Blog.deleteOne({ _id: id });
        },

        updateBlog: async (id:string, data:any):Promise<BlogResponseNoAuthor> => {$
            const cacheKey = `Blog:${id}`
            const blog = await Blog.findByIdAndUpdate(id, data, {new: true, runValidators: true}).lean().exec()
            
            if (!blog){
                throw new Error(`No Blog found id: ${id}`)
            }
            
            const blogResponse =  {
                id: blog._id.toString(),            
                title: blog.title,
                content: blog.content,
                banner: blog.banner,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
                viewsCount: blog.viewsCount,
                likesCount: blog.likesCount,
                commentsCount: blog.commentsCount
            }

            await redisClient.set(cacheKey, JSON.stringify(blogResponse), { EX: 3600})

            if(data.slug) {
                await redisClient.set(
                    `Blog:slug:${data.slug}`,
                    JSON.stringify(blogResponse),
                    { EX: 3600 }
                );
            }

            await redisClient.del(`Blogs:user:${blog.author.toString()}`);

            return blogResponse;
        }
    }
}