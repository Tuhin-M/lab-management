
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/role');
const { check, validationResult } = require('express-validator');

// @route   GET /api/blog/posts
// @desc    Get all blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, tag, search, limit = 10, page = 1 } = req.query;

    let whereClause = { isPublished: true };

    if (category) {
      whereClause.category = { name: category };
    }

    if (tag) {
      whereClause.tags = { has: tag };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, name: true } },
        category: true
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.blogPost.count({ where: whereClause });

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
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        comments: {
          include: {
            user: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } }
    });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blog/categories
// @desc    Get all blog categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
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
    // Prisma doesn't have a direct "distinct" on array elements yet, so we get all and process
    const postsWithTags = await prisma.blogPost.findMany({
      select: { tags: true },
      where: { isPublished: true }
    });

    const allTags = new Set();
    postsWithTags.forEach(p => p.tags.forEach(t => allTags.add(t)));

    const sortedTags = Array.from(allTags).sort().map(t => ({ name: t }));

    res.json(sortedTags);
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
    check('category', 'Category name is required').not().isEmpty()
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

    // Find or create category
    let categoryEntity = await prisma.category.findUnique({
      where: { name: category }
    });
    if (!categoryEntity) {
      categoryEntity = await prisma.category.create({
        data: { name: category, description: `${category} blogs` }
      });
    }

    // Create new post
    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        authorId: req.user.id,
        categoryId: categoryEntity.id,
        tags: tags || [],
        coverImage: coverImage || 'default-blog.jpg',
        readTime: readTime ? parseInt(readTime) : 5,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishedAt: isPublished ? new Date() : null
      },
      include: {
        author: { select: { id: true, name: true } }
      }
    });

    res.json(post);
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

    let post = await prisma.blogPost.findUnique({
      where: { id: req.params.id }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user is the post author or admin
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let categoryId = undefined;
    if (category) {
      let categoryEntity = await prisma.category.findUnique({ where: { name: category } });
      if (!categoryEntity) {
        categoryEntity = await prisma.category.create({ data: { name: category, description: `${category} blogs` } });
      }
      categoryId = categoryEntity.id;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title: title || undefined,
        content: content || undefined,
        categoryId: categoryId || undefined,
        tags: tags || undefined,
        coverImage: coverImage || undefined,
        readTime: readTime ? parseInt(readTime) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        publishedAt: (isPublished && !post.isPublished) ? new Date() : undefined
      },
      include: { author: { select: { id: true, name: true } } }
    });

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blog/posts/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Make sure user is the post author or admin
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.blogPost.delete({ where: { id: req.params.id } });

    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
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
    const postId = req.params.id;

    const comment = await prisma.comment.create({
      data: {
        text,
        userId: req.user.id,
        postId
      },
      include: { user: { select: { id: true, name: true } } }
    });

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blog/posts/:id/comments/:comment_id
// @desc    Delete comment from a blog post
// @access  Private
router.delete('/posts/:id/comments/:comment_id', auth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.comment_id }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check user ownership or admin
    if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await prisma.comment.delete({ where: { id: req.params.comment_id } });

    res.json({ message: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
