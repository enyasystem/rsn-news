import { createProfile, getProfileByEmail } from './lib/db';

const adminId = 'admin-1';
const adminEmail = 'admin@rsn-news.com';

createProfile({ id: adminId, email: adminEmail, password: 'adminpassword', role: 'admin' });

console.log('Admin profile:', getProfileByEmail(adminEmail));
