import { getPosts } from '../lib/posts'

export default async function PostsPage() {
  let posts = [];
  
  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  
  return (
    <div>
      {posts.map((post) => (
        post.id && post.title ? (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </div>
        ) : null
      ))}
    </div>
  )
} 