import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';

import Vuex from 'vuex';
import VueWaves from 'vue-waves';
import VueSocketio from 'vue-socket.io';

//custom
import { Auth } from 'src/helpers/auth';

//mine
import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/Loader';
import Chat from 'components/Chat/Chat';

import _ from 'lodash';

// const p_options = {
//   color: '#bffaf3',
//   failedColor: '#874b4b',
//   thickness: '10px',
//   transition: {
//     speed: '0.5s',
//     opacity: '1s'
//   },
//   autoRevert: true,
//   location: 'left',
//   inverse: false
// };

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(Vuex);
Vue.use(VueWaves);

import routes from 'src/routes';
import 'src/style.scss';

import { verifyResource } from 'src/helpers/resources';

const store = new Vuex.Store({
  state: {
    user: { //keep a copy of the user object on the client side, this is reactive
      _id: '',
      email: '',
      password: '',
      username: '',
      first_name: '',
      last_name: '',
      gender: '',
      weight: 0,
      height: 0,
      speak_english: 'Okay',
      have_children: false,
      want_children: false,
      age: 0,
      profile_pic: '',
      avatar: '',
      thumbnail: '',
      dob: false,
      education: '',
      job: '',
      salary: 0,
      religion: '',
      wants: {
        min_age: 0,
        max_age: 0,
        gender: false
      },
      background: '',
      background_image: '',
      love: [],
      like: [],
      _comments: [],
      gallery: []
    },
    authenticated: false,
    token: '',
    users: [],
    chat: [],
    chats: []
  },
  mutations: {
    updateChat(state, user) {
      if (user.profile_pic) {
        user.avatar = 'http://127.0.0.1:8088/uploads/' + user.profile_pic + '-avatar';
      }

      if (!_.some(state.chat, { _id: user._id })) {
        user.unread = 0;
        state.chat.push(user);
      } else {
        var index = _.findIndex(state.chat, { _id: user._id });

        var chat = state.chat[index];
        chat.active = true;
        chat.remove = false;
        chat.unread = 0;
        state.chat[index] = chat;
      }
    },
    closeChat(state, index) {
      state.chat[index].active = false;
    },
    deleteChat(state, index) {
      state.chat[index].remove = true;
      _.pullAt(state.chat, index);
    },
    message(state, data) {
      state.chat[data.index].messages.push(data);

      if (state.chat[data.index].active === false) {
        state.chat[data.index].unread++;
      }
    },
    updateUser(state, user) {
      var key;
      var keys = Object.keys(user);

      for (key of keys) {
        if (key === 'profile_pic') {
          state.user[key] = 'http://127.0.0.1:8088/uploads/' + user[key]; //full
          state.user.thumbnail = 'http://127.0.0.1:8088/uploads/' + user[key] + '-thumbnail';
          state.user.avatar = 'http://127.0.0.1:8088/uploads/' + user[key] + '-avatar';
        } else if (key === 'wants') {
          //get a new key
          var new_key;
          var new_keys = Object.keys(user.wants);
          for (new_key of new_keys) {
            state.user.wants[new_key] = user.wants[new_key];
          }
        } else {
          state.user[key] = user[key];
        }
      }
    },
    addComment(state, comment) {
      state.user._comments.push(comment);
    },
    updateAuthenticated(state, auth) {
      state.authenticated = auth;
    },
    updateToken(state, token) {
      state.token = token;
    }
  }
});

Vue.use(Auth, { store: store });

export const LoadingState = new Vue();

export const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/') {
    var jwt = localStorage.getItem('id_token');
    if (jwt === null) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});

Vue.use(VueSocketio, 'http://127.0.0.1:8088');

export const App = new Vue({
  router,
  store,
  components: {
    Navigation,
    Loader,
    Chat
  },
  sockets: {
    authenticated: function() {
      console.log('authenticated');
    },
    unauthorized: function(msg) {
      console.log(msg);
    },
    helloworld: function(data) {
      console.log(data);
    }
  },
  data(){
    return {
      isLoading: false
    };
  },
  beforeCreate() {
    if (this.$store.state.token !== '') {
      var this$ = this;
      verifyResource.save({ token: this.$store.state.token }).then((response) => {
        this.$store.commit('updateUser', response.body);

        _.forEach(response.body._friends, function(value) {
          value.active = false;
          value.messages = [];
          value.unread = 0;
          value.remove = false;
          this$.$store.commit('updateChat', value);
        });

        this.$socket.emit('authenticate', { token: this.$store.state.token });
      }, (errorResponse) => {
        console.log(errorResponse);
      });
    }
  },
  created(){
    LoadingState.$on('toggle', (isLoading) => {
      this.isLoading = isLoading;
    });
  }
}).$mount('#app');
