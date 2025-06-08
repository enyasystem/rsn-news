// test-db.mjs
import db, {
  createProfile,
  getProfileById,
  deleteProfile,
  createNews,
  getAllNews,
  updateNews,
  getNewsById,
  deleteNews
} from './lib/db.js';

// 1. Create a profile
const userId = 'test-user-1';
createProfile({ id: userId, email: 'testuser@example.com', role: 'admin' });
console.log('Profile created:', getProfileById(userId));

// 2. Create a news post
createNews({
  title: 'Test News',
  content: 'This is a test news article.',
  category: 'general',
  image_url: '/images/news/test.jpg',
  author_id: userId,
});
console.log('All news:', getAllNews());

// 3. Update the news post
const news = getAllNews()[0];
updateNews({
  id: news.id,
  title: 'Updated News',
  content: 'Updated content.',
  category: 'updates',
  image_url: '/images/news/updated.jpg',
});
console.log('Updated news:', getNewsById(news.id));

// 4. Delete the news post
deleteNews(news.id);
console.log('All news after delete:', getAllNews());

// 5. Delete the profile
deleteProfile(userId);
console.log('Profile after delete:', getProfileById(userId));
