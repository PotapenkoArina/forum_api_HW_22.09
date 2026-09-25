import { getAll, getById, addPost } from '../repositories/post.js';

// сервис связывает handlers с repository
export function getPosts(category, take) {
	return getAll(category, take);
}

export function getPostById(id) {
	return getById(id);
}

export function createPost(post) {
	return addPost(post);
}