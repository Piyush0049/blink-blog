const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  blogText: {
    type: String,
    required: true,
  },
  media: {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    }
  },
  relatedTo: {
    type: [String],
    required: true,
    default: [],
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;
