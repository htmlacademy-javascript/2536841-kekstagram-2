import {posts} from './createPostsArray.js';
import {renderPosts} from './posts.js';
import './viewPost.js';

const POSTS_COUNT = 25;
renderPosts(posts(POSTS_COUNT));
