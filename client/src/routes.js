import Home from 'components/Home/home';
import Profile from 'components/Profile/profile';
import Member from 'components/Member/entry';
import Posts from 'components/Posts/posts';
import Post from 'components/Posts/post';
import NotFound from 'components/NotFound/notFound';
import Search from 'components/Search/search';
import Dashboard from 'components/Dashboard/dashboard';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/dashboard/',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/profile/:id/settings',
    name: 'profile-settings',
    component: Profile,
  },
  {
    path: '/profile/:id/home',
    name: 'profile-home',
    component: Profile,
  },
  {
    path: '/profile/:id/job-status',
    name: 'profile-job-status',
    component: Profile,
  },
  {
    path: '/profile/:id/appearance',
    name: 'profile-appearance',
    component: Profile,
  },
  {
    path: '/profile/:id/wants',
    name: 'profile-wants',
    component: Profile,
  },
  {
    path: '/profile/:id/gallery',
    name: 'profile-gallery',
    component: Profile,
  },
  {
    path: '/user/:userid',
    name: 'members',
    component: Member
  },
  {
    path: '/user/:userid/profile',
    name: 'members-profile',
    component: Member,
  },
  {
    path: '/user/:userid/gallery',
    name: 'members-gallery',
    component: Member,
  },
  {
    path: '/user/:userid/chat',
    name: 'members-chat',
    component: Member,
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/posts',
    component: Posts
  },
  {
    path: '/post/:id',
    name: 'post',
    component: Post
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
