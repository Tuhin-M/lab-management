
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET /api/blog/posts
// @desc    Get all blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    // Handle query parameters for filtering
    const { category, tag, search, limit = 10, page = 1 } = req.query;
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await BlogPost.find(query)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blog/posts/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blog/categories
// @desc    Get all blog categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blog/tags
// @desc    Get all unique tags from blog posts
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $project: { _id: 0, name: '$_id' } },
      { $sort: { name: 1 } }
    ]);
    
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/blog/posts
// @desc    Create a new blog post
// @access  Private
router.post('/posts', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      title, content, category, tags, coverImage, 
      readTime, isPublished 
    } = req.body;
    
    // Create new post
    const post = new BlogPost({
      title,
      content,
      author: req.user.id,
      category,
      tags: tags || [],
      coverImage: coverImage || 'default-blog.jpg',
      readTime: readTime || 5,
      isPublished: isPublished !== undefined ? isPublished : true,
      publishedAt: isPublished ? Date.now() : null
    });

    await post.save();
    
    const populatedPost = await BlogPost.findById(post._id)
      .populate('author', 'name');
    
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/blog/posts/:id
// @desc    Update a blog post
// @access  Private
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const { 
      title, content, category, tags, coverImage, 
      readTime, isPublished 
    } = req.body;
    
    let post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Make sure user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build post object
    const postFields = {};
    if (title) postFields.title = title;
    if (content) postFields.content = content;
    if (category) postFields.category = category;
    if (tags) postFields.tags = tags;
    if (coverImage) postFields.coverImage = coverImage;
    if (readTime) postFields.readTime = readTime;
    if (isPublished !== undefined) {
      postFields.isPublished = isPublished;
      // If publishing for the first time
      if (isPublished && !post.isPublished) {
        postFields.publishedAt = Date.now();
      }
    }
    
    post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    ).populate('author', 'name');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blog/posts/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Make sure user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await post.deleteOne();
    
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/blog/posts/:id/comments
// @desc    Add comment to a blog post
// @access  Private
router.post('/posts/:id/comments', [
  auth,
  [check('text', 'Comment text is required').not().isEmpty()]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { text } = req.body;
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = {
      user: req.user.id,
      text
    };
    
    post.comments.unshift(comment);
    
    await post.save();
    
    const populatedPost = await BlogPost.findById(post._id)
      .populate('author', 'name')
      .populate('comments.user', 'name');
    
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blog/posts/:id/comments/:comment_id
// @desc    Delete comment from a blog post
// @access  Private
router.delete('/posts/:id/comments/:comment_id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Pull out comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Remove comment
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.comment_id
    );
    
    await post.save();
    
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
