import {
  createProfile,
  getProfileById,
  deleteProfile,
  createNews,
  getAllNews,
  updateNews,
  getNewsById,
  deleteNews
} from './lib/db';

// 1. Create a profile
const userId = 'test-user-1';
createProfile({ id: userId, email: 'testuser@example.com', password: 'testpassword', role: 'admin' });
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
const newsList = getAllNews();
const news = Array.isArray(newsList) && newsList.length > 0 ? (newsList[0] as { id?: number }) : null;
if (news && typeof news.id === 'number') {
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
} else {
  console.log('No news found to update/delete.');
}

// 5. Delete the profile
deleteProfile(userId);
console.log('Profile after delete:', getProfileById(userId));
