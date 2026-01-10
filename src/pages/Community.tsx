import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  Image as ImageIcon,
  Users,
  TrendingUp,
  Award,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Eye,
  Clock,
  X,
  Flame,
  Zap,
  Edit,
  Trash2,
  Link as LinkIcon,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { blogAPI, authAPI, userAPI } from "@/services/api";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types for our data
interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    isVerified: boolean;
    followers: number;
  };
  content: string;
  image?: string;
  createdAt: string;
  views: number;
  reactions: { like: number; love: number; celebrate: number };
  userReaction: string | null;
  saved: boolean;
  comments: Comment[];
  tags: string[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likes: number;
}

const trendingTopics = [
  { tag: "#DiabetesAwareness", posts: 234, trending: true },
  { tag: "#MentalHealth", posts: 189, trending: true },
  { tag: "#FitnessGoals", posts: 156, trending: false },
  { tag: "#HealthyEating", posts: 143, trending: false },
  { tag: "#HeartHealth", posts: 98, trending: true },
];

const topContributors = [
  { name: "Dr. Sarah Johnson", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", posts: 45, isVerified: true },
  { name: "HealthPlus Labs", avatar: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100", posts: 38, isVerified: true },
  { name: "Dr. Priya Patel", avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100", posts: 32, isVerified: true },
];

type ReactionType = "like" | "love" | "celebrate";

const Community = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await authAPI.getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await blogAPI.getAllPosts();
      if (data) {
        // Transform Supabase data to our UI model
        // Warning: This is a simplification. Real implementation would need careful mapping
        // of join results. 
        // For now, assuming standard struct, or we can use the any type if needed temporarily
        const mappedPosts: Post[] = data.map((p: any) => {
          // Try to get name from author, or derive from email/user_id
          let authorName = p.author?.name;
          if (!authorName || authorName === 'Community Member') {
            // Use part of user_id as fallback to make names more identifiable
            authorName = p.user_id ? `User ${p.user_id.substring(0, 8)}` : 'Anonymous';
          }
          
          return {
            id: p.id,
            author: {
              id: p.user_id,
              name: authorName,
              avatar: p.author?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${p.user_id}`,
              title: 'Community Member',
              isVerified: false,
              followers: 0
            },
            content: p.content,
            image: p.image_url,
            createdAt: new Date(p.created_at).toLocaleDateString(),
            views: p.view_count || 0,
            reactions: { like: p.likes || 0, love: 0, celebrate: 0 },
            userReaction: null,
            saved: false,
            comments: [],
            tags: p.tags || []
          };
        });
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error("Failed to load posts", error);
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post detail view from URL
  useEffect(() => {
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [postId, posts]);

  const handleCreatePost = async () => {
    if (!currentUser) {
      toast.error("Please login to create a post");
      navigate("/login");
      return;
    }

    if (!newPostContent.trim()) {
      toast.error("Please write something to post");
      return;
    }

    // Extract hashtags
    const tags = newPostContent.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    try {
      // Optimistic update can be added here
      const { data, error } = await blogAPI.createPost({
        content: newPostContent,
        tags: tags,
        user_id: currentUser.id
      });
      
      if (error) throw error;

      toast.success("🎉 Post created successfully!");
      setNewPostContent("");
      fetchPosts(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    }
  };

  const handleReaction = async (postId: string, type: ReactionType) => {
    if (!currentUser) {
        toast.error("Login to react");
        return;
    }
    // Optimistic UI update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasReacted = post.userReaction === type;
        return {
          ...post,
          userReaction: wasReacted ? null : type,
          reactions: {
            ...post.reactions,
            [type]: wasReacted ? post.reactions[type] - 1 : post.reactions[type] + 1,
          },
        };
      }
      return post;
    }));
    
    // TODO: Call API to persist like
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasSaved = post.saved;
        toast.success(wasSaved ? "Removed from saved" : "Added to saved posts");
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
  };

  const handleComment = async (postId: string) => {
    if (!currentUser) {
      toast.error("Please login to comment");
      navigate("/login");
      return;
    }

    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
        await blogAPI.addComment(postId, commentText, currentUser.id);
        
        setCommentInputs({ ...commentInputs, [postId]: "" });
        toast.success("Comment added!");
        fetchPosts(); // Refresh to show new comment
    } catch (e) {
        toast.error("Failed to add comment");
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    navigate(`/community/post/${post.id}`, { replace: true });
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    navigate("/community", { replace: true });
  };

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleEditPost = async () => {
    if (!editingPost || !editContent.trim()) return;
    
    const tags = editContent.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    
    try {
      const { error } = await blogAPI.editPost(editingPost.id, { 
        content: editContent,
        tags 
      });
      
      if (error) throw error;
      
      toast.success("Post updated!");
      setEditingPost(null);
      setEditContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    
    try {
      const { error } = await blogAPI.deletePost(deletePostId);
      
      if (error) throw error;
      
      toast.success("Post deleted!");
      setDeletePostId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  const handlePoll = () => {
    toast("🗳️ Poll feature coming soon!", { description: "Stay tuned for updates!" });
  };

  const startEditPost = (post: Post) => {
    setEditingPost(post);
    setEditContent(post.content);
  };

  const isPostOwner = (post: Post) => {
    if (!currentUser) {
      console.log("isPostOwner: No currentUser");
      return false;
    }
    console.log("isPostOwner check:", { currentUserId: currentUser.id, postAuthorId: post.author.id, match: currentUser.id === post.author.id });
    return currentUser.id === post.author.id;
  };

  const filteredPosts = filterTag 
    ? posts.filter(post => post.tags.includes(filterTag))
    : posts;

  const totalReactions = (post: Post) => 
    post.reactions.like + post.reactions.love + post.reactions.celebrate;

  // Post Card Component
  const PostCard = ({ post, isDetail = false }: { post: Post, isDetail?: boolean }) => (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden group transition-all duration-300">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isDetail && openPostDetail(post)}>
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white font-bold">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold hover:text-primary transition-colors">{post.author.name}</h3>
                {post.author.isVerified && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0">
                    <Award className="h-3 w-3 mr-0.5" /> Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.title}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.views.toLocaleString()}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isPostOwner(post) ? (
                  <>
                    <DropdownMenuItem onClick={() => startEditPost(post)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeletePostId(post.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => handleShare(post)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-3">
        <p 
          className={`whitespace-pre-wrap text-gray-800 leading-relaxed ${!isDetail && 'cursor-pointer'}`}
          onClick={() => !isDetail && openPostDetail(post)}
        >
          {post.content}
        </p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {post.image && (
          <div 
            className={`mt-4 rounded-xl overflow-hidden ${!isDetail && 'cursor-pointer'}`}
            onClick={() => !isDetail && openPostDetail(post)}
          >
            <img src={post.image} alt="Post" className="w-full object-cover max-h-[400px] hover:scale-[1.02] transition-transform duration-300" />
          </div>
        )}
        
        {/* Reaction Summary */}
        {totalReactions(post) > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex -space-x-1">
              {post.reactions.like > 0 && <span className="text-base">👍</span>}
              {post.reactions.love > 0 && <span className="text-base">❤️</span>}
              {post.reactions.celebrate > 0 && <span className="text-base">✨</span>}
            </div>
            <span>{totalReactions(post).toLocaleString()} reactions</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-gray-100 flex-col">
        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full hover:bg-blue-50 transition-all ${post.userReaction === 'like' ? 'text-blue-600 bg-blue-50' : ''}`}
              onClick={() => handleReaction(post.id, "like")}
            >
              <ThumbsUp className={`h-4 w-4 mr-1.5 ${post.userReaction === 'like' ? 'fill-current' : ''}`} />
              {post.reactions.like > 0 && post.reactions.like}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full hover:bg-red-50 transition-all ${post.userReaction === 'love' ? 'text-red-500 bg-red-50' : ''}`}
              onClick={() => handleReaction(post.id, "love")}
            >
              <Heart className={`h-4 w-4 mr-1.5 ${post.userReaction === 'love' ? 'fill-current' : ''}`} />
              {post.reactions.love > 0 && post.reactions.love}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full hover:bg-yellow-50 transition-all ${post.userReaction === 'celebrate' ? 'text-yellow-600 bg-yellow-50' : ''}`}
              onClick={() => handleReaction(post.id, "celebrate")}
            >
              <Sparkles className={`h-4 w-4 mr-1.5 ${post.userReaction === 'celebrate' ? 'fill-current' : ''}`} />
              {post.reactions.celebrate > 0 && post.reactions.celebrate}
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => isDetail ? null : toggleComments(post.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              {post.comments.length > 0 && post.comments.length}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-full ${post.saved ? 'text-primary' : ''}`}
              onClick={() => handleSave(post.id)}
            >
              {post.saved ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full"
              onClick={() => handleShare(post)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {(expandedComments.includes(post.id) || isDetail) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-3 mt-4"
            >
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {comment.likes > 0 && comment.likes}
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-primary">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Comment Input */}
              <div className="flex gap-3 pt-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser?.user_metadata?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    className="rounded-full border-gray-200"
                    onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                  />
                  <Button
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={() => handleComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="fixed left-0 top-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 to-purple-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed right-0 bottom-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-500/8 to-blue-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Users className="h-8 w-8" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Health Community</h1>
                </div>
                <p className="text-white/80 text-lg max-w-xl">Share, learn, and connect with healthcare professionals and wellness enthusiasts</p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">{posts.length}</p>
                  <p className="text-sm text-white/70">Posts</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">2.5K</p>
                  <p className="text-sm text-white/70">Members</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">12K</p>
                  <p className="text-sm text-white/70">Reactions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Filter */}
        {filterTag && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <span>Showing posts with #{filterTag}</span>
              <button onClick={() => setFilterTag(null)} className="hover:bg-blue-100 rounded-full p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2">
                      <AvatarImage src={currentUser?.user_metadata?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email}`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white">
                        {currentUser?.user_metadata?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      {/* Enhanced Textarea */}
                      <div className="relative">
                        <Textarea
                          placeholder="Share something about health, wellness, or your medical insights... ✨"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="min-h-[140px] resize-none border-gray-200 focus:ring-2 focus:ring-primary/20 rounded-xl text-base bg-gradient-to-br from-white to-slate-50 placeholder:text-muted-foreground/60"
                        />
                        {/* Character Counter */}
                        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                          <span className={newPostContent.length > 500 ? "text-red-500 font-semibold" : ""}>{newPostContent.length}</span>/500
                        </div>
                      </div>
                      
                      {/* Quick Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">Quick tags:</span>
                        {["#HealthTip", "#Wellness", "#MentalHealth", "#Fitness", "#Nutrition"].map(tag => (
                          <button
                            key={tag}
                            onClick={() => setNewPostContent(prev => prev + " " + tag)}
                            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      
                      {/* Image URL Input */}
                      {showImageInput && (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                          <div className="flex-1 relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Paste image URL here..."
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              className="pl-9 rounded-xl border-gray-200"
                            />
                          </div>
                          {imageUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setImageUrl("")}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      {/* Image Preview */}
                      {imageUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200">
                          <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="w-full max-h-[200px] object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              toast.error("Invalid image URL");
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`rounded-xl hover:bg-blue-50 hover:text-blue-600 ${showImageInput ? 'bg-blue-50 text-blue-600' : 'text-muted-foreground'}`}
                            onClick={() => setShowImageInput(!showImageInput)}
                          >
                            <ImageIcon className="h-5 w-5 mr-1.5" />
                            Photo
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground rounded-xl hover:bg-purple-50 hover:text-purple-600"
                            onClick={handlePoll}
                          >
                            <Zap className="h-5 w-5 mr-1.5" />
                            Poll
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground rounded-xl hover:bg-orange-50 hover:text-orange-600">
                            <Sparkles className="h-5 w-5 mr-1.5" />
                            Tips
                          </Button>
                        </div>
                        <Button 
                          onClick={handleCreatePost} 
                          className="rounded-xl shadow-lg px-6 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 hover:scale-105 transition-all"
                          disabled={!newPostContent.trim() || newPostContent.length > 500}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Feed */}
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found for #{filterTag}</p>
                <Button variant="link" onClick={() => setFilterTag(null)}>Clear filter</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    Trending Topics
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.tag}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        filterTag === topic.tag.slice(1) ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setFilterTag(filterTag === topic.tag.slice(1) ? null : topic.tag.slice(1))}
                    >
                      <div className="flex items-center gap-2">
                        {topic.trending && <TrendingUp className="h-4 w-4 text-orange-500" />}
                        <span className="font-medium">{topic.tag}</span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">{topic.posts}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                    <div className="p-1.5 bg-yellow-100 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    Top Contributors
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div
                      key={contributor.name}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <span className={`text-lg font-bold w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                        #{index + 1}
                      </span>
                      <Avatar className="h-10 w-10 ring-2 ring-offset-1 ring-gray-100">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-medium truncate">{contributor.name}</p>
                          {contributor.isVerified && <Award className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{contributor.posts} posts</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => closePostDetail()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={closePostDetail} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle>Post</DialogTitle>
            </div>
          </DialogHeader>
          {selectedPost && (
            <div className="p-4">
              <PostCard post={selectedPost} isDetail />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Post
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[150px] resize-none"
              placeholder="Edit your post..."
            />
            <div className="flex justify-between items-center">
              <span className={`text-xs ${editContent.length > 500 ? "text-red-500" : "text-muted-foreground"}`}>
                {editContent.length}/500
              </span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditPost}
              disabled={!editContent.trim() || editContent.length > 500}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post
              and remove it from the community feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Community;
