import Vue from 'vue';
import VueResource from 'vue-resource';
import { router } from 'src/main';

const API_BASE = 'http://127.0.0.1:8088/';

import { LoadingState } from 'src/main';

Vue.use(VueResource);

Vue.http.options = {
  root: API_BASE
};

var token = '';
if (localStorage.getItem('id_token') === null) {
  token = 'false';
} else {
  token = localStorage.getItem('id_token');
}

Vue.http.headers.common['x-access-token'] = token;

Vue.http.interceptors.push((request, next) => {
  console.log('1');
  LoadingState.$emit('toggle', true);

  next((response) => {
    setTimeout(function() {
      LoadingState.$emit('toggle', false);
    }, 500);
    // Handle global API 404 =>
    if (response.status === 404) {
      router.push('/404');
    }
  });
});

export const signupResource = Vue.resource(API_BASE + 'signup');

export const verifyResource = Vue.resource(API_BASE + 'verify');

//profile routes
export const loveResource = Vue.resource(API_BASE + 'auth/profile/love');
export const likeResource = Vue.resource(API_BASE + 'auth/profile/like');
export const commentResource = Vue.resource(API_BASE + 'auth/profile/comment');
export const profileKeyDetailsResource = Vue.resource(API_BASE + 'auth/profile/update');
export const deleteImageResource = Vue.resource(API_BASE + 'auth/profile/delete-image');
export const imageUploadResource = Vue.resource(API_BASE + 'auth/profile/upload', {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

//dashboard
export const getLikesResource = Vue.resource(API_BASE + 'auth/profile/getlikes');
export const getLovesResource = Vue.resource(API_BASE + 'auth/profile/getloves');
export const getFriendsResource = Vue.resource(API_BASE + 'auth/profile/getfriends');
export const getCommentsResource = Vue.resource(API_BASE + 'auth/profile/getcomments');

//chat related
export const addFriendResource = Vue.resource(API_BASE + 'auth/profile/addfriend');
export const messageResource = Vue.resource(API_BASE + 'auth/profile/messages');
export const blockFriendResource = Vue.resource(API_BASE + 'auth/profile/blockfriend');

export const membersResource = Vue.resource(API_BASE + 'auth/member/fetchUser');

export const searchResource = Vue.resource(API_BASE + 'auth/search/get');

export const recentResource = Vue.resource(API_BASE + 'content/recent');
