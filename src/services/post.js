import * as postRepository from '../repositories/post.js';

const getPosts = (category, take) => postRepository.getAll(category, take);

const getPostById = (id) => postRepository.getById(id);

const createPost = (post) => postRepository.addPost(post);

export { getPosts, getPostById, createPost };