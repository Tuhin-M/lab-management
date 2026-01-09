import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Clock, Calendar, ChevronRight, ArrowRight, Tag } from "lucide-react";

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Understanding Complete Blood Count Test: What the Results Mean",
    excerpt: "A complete blood count (CBC) is one of the most common blood tests ordered by healthcare providers. It provides valuable information about various components of your blood and can help detect a wide range of disorders.",
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755169?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Lab Tests",
    date: "June 15, 2023",
    readTime: "5 min read",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Hematologist"
    },
    tags: ["Blood Tests", "CBC", "Diagnostics", "Health"]
  },
  {
    id: 2,
    title: "Choosing the Right Doctor: A Comprehensive Guide",
    excerpt: "Finding the right doctor is one of the most important decisions you can make for your health. This guide will help you navigate the process of selecting a healthcare provider who meets your needs.",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Healthcare",
    date: "May 28, 2023",
    readTime: "8 min read",
    author: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Primary Care Physician"
    },
    tags: ["Doctor Selection", "Healthcare", "Patient Care"]
  },
  {
    id: 3,
    title: "Thyroid Function Tests: What You Need to Know",
    excerpt: "Thyroid function tests are a series of blood tests used to measure how well your thyroid gland is working. This article explains what these tests measure and what the results might mean.",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b7e9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Lab Tests",
    date: "April 10, 2023",
    readTime: "6 min read",
    author: {
      name: "Dr. Priya Patel",
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Endocrinologist"
    },
    tags: ["Thyroid", "Hormones", "Diagnostics", "Endocrinology"]
  },
  {
    id: 4,
    title: "Home Sample Collection: Benefits and What to Expect",
    excerpt: "With the rise of home sample collection services, getting lab tests has become more convenient than ever. Learn about the benefits of this service and what to expect during the process.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    category: "Services",
    date: "March 22, 2023",
    readTime: "4 min read",
    author: {
      name: "Ananya Gupta",
      avatar: "https://images.unsplash.com/photo-1573497019940-c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Healthcare Consultant"
    },
    tags: ["Home Collection", "Convenience", "Lab Tests", "Healthcare Services"]
  },
  {
    id: 5,
    title: "Understanding Diabetes Tests: HbA1c, Fasting Glucose, and More",
    excerpt: "Diabetes is a growing concern worldwide. This article explains the different tests used to diagnose and monitor diabetes, helping you understand what each test measures.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    category: "Lab Tests",
    date: "February 18, 2023",
    readTime: "7 min read",
    author: {
      name: "Dr. Ramesh Kumar",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80",
      title: "Diabetologist"
    },
    tags: ["Diabetes", "HbA1c", "Blood Sugar", "Diagnostics"]
  },
  {
    id: 6,
    title: "Telemedicine: The Future of Healthcare Consultation",
    excerpt: "Telemedicine has seen rapid growth, especially since the COVID-19 pandemic. This article explores the benefits, limitations, and future of virtual healthcare consultations.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    category: "Healthcare",
    date: "January 5, 2023",
    readTime: "5 min read",
    author: {
      name: "Dr. Aditya Sharma",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      title: "Digital Health Specialist"
    },
    tags: ["Telemedicine", "Virtual Care", "Healthcare Technology", "Remote Consultation"]
  }
];

// Categories
const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Lab Tests", count: blogPosts.filter(post => post.category === "Lab Tests").length },
  { name: "Healthcare", count: blogPosts.filter(post => post.category === "Healthcare").length },
  { name: "Services", count: blogPosts.filter(post => post.category === "Services").length },
  { name: "Wellness", count: blogPosts.filter(post => post.category === "Wellness").length },
];

// Popular tags
const popularTags = [
  "Blood Tests", "Health", "Diagnostics", "Healthcare", 
  "Wellness", "Telemedicine", "Doctors", "Nutrition", "Diabetes"
];

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  // Featured post (first post)
  const featuredPost = blogPosts[0];
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const searchResults = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(searchResults);
    } else {
      setFilteredPosts(blogPosts);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    if (category === "All") {
      setFilteredPosts(blogPosts);
    } else {
      const categoryResults = blogPosts.filter(post => post.category === category);
      setFilteredPosts(categoryResults);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Ekitsa Health Blog
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Insights, tips, and information about healthcare, lab tests, and wellness
              </p>
              
              <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for articles..."
                    className="pl-9 pr-4 h-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden aspect-video shadow-lg">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {featuredPost.category}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {featuredPost.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center mb-6">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                  <AvatarFallback>{featuredPost.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{featuredPost.author.name}</p>
                  <p className="text-sm text-muted-foreground">{featuredPost.author.title}</p>
                </div>
                <div className="ml-auto flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              
              <Button onClick={() => navigate(`/blog/${featuredPost.id}`)}>
                Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content */}
              <div className="md:w-3/4">
                <Tabs 
                  defaultValue={activeCategory} 
                  onValueChange={handleCategoryChange}
                  className="w-full mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{activeCategory === "All" ? "All Articles" : activeCategory}</h2>
                    
                    <TabsList>
                      {categories.map((category) => (
                        <TabsTrigger 
                          key={category.name} 
                          value={category.name}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {category.name} ({category.count})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {categories.map((category) => (
                    <TabsContent key={category.name} value={category.name} className="mt-0">
                      {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredPosts.filter(post => category.name === "All" || post.category === category.name).map((post) => (
                            <Card key={post.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                              <div className="rounded-xl aspect-video overflow-hidden relative shadow-lg">
                                <img 
                                  src={post.image} 
                                  alt={post.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2">
                                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                    {post.category}
                                  </span>
                                </div>
                              </div>
                              
                              <CardContent className="p-4 flex-grow">
                                <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                                  {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{post.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{post.readTime}</span>
                                  </div>
                                </div>
                              </CardContent>
                              
                              <CardFooter className="p-4 pt-0 border-t mt-auto">
                                <div className="flex items-center w-full">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm overflow-hidden">
                                    <p className="font-medium truncate">{post.author.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{post.author.title}</p>
                                  </div>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground mb-4">No articles found matching your search criteria.</p>
                          <Button variant="outline" onClick={() => { setSearchQuery(""); setFilteredPosts(blogPosts); }}>
                            Clear Search
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
                
                {filteredPosts.length > 0 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                      Load More Articles
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="md:w-1/4 space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-block bg-accent hover:bg-accent/80 text-accent-foreground text-xs px-3 py-1 rounded-full cursor-pointer"
                          onClick={() => {
                            setSearchQuery(tag);
                            const searchResults = blogPosts.filter(post => 
                              post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
                            );
                            setFilteredPosts(searchResults);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4">Popular Posts</h3>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex items-start space-x-2">
                          <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium line-clamp-2 hover:text-primary cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                              {post.title}
                            </h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4">Subscribe</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest health articles and updates delivered to your inbox
                    </p>
                    <form className="space-y-2">
                      <Input
                        placeholder="Your email address"
                        type="email"
                      />
                      <Button className="w-full">
                        Subscribe
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Take charge of your health today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book a lab test or doctor appointment and start your journey towards better health
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/labs")}>
                Book a Lab Test
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/doctors")}>
                Find a Doctor
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}

    </div>
  );
};

export default Blog;
