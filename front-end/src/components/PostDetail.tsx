import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getPostById,type Post } from "../lib/api";
export default function PostDetail() {
  const { id } = useParams<{ id: string }>(); 
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await getPostById(id);
          setPost(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
        setLoading(false);
    }
  }, [id]);
  if (loading) {
    return <div>加载中...</div>;
  }
  if (!post) {
    return <div>文章未找到</div>;
  }
  return (
    <div>
      <h1>{post.title}</h1>
      {post.image && <img src={post.image} alt={post.title} className="w-100% h-auto"/>}
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}