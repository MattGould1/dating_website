import Vue from 'vue';
import template from './user-sidebar.html';

import { loveResource, likeResource, addFriendResource } from 'src/helpers/resources';

import VueCoreImageUpload from 'vue2.x-core-image-upload';
import _ from 'lodash';
export default Vue.component('user-sidebar', {
  template: template,
  props: [
    'userobj'
  ],
  components: {
    'vue-core-image-upload': VueCoreImageUpload
  },
  data() {
    return {
      love: '',
      like: ''
    };
  },
  updated() {
    var this$ = this;
    var loved = _.findIndex(this.userobj.__love, function(o) { return o.by === this$.$store.state.user._id; });
    var liked = _.findIndex(this.userobj.__like, function(o) { return o.by === this$.$store.state.user._id; });

    if (this.userobj.__love !== undefined && loved >= 0) {
      this.love = 'red';
    }

    if (this.userobj.like !== undefined && liked >= 0) {
      this.like = '#0d47a1';
    }
  },
  created() {
    var this$ = this;
    var loved = _.findIndex(this.userobj.__love, function(o) { return o.by === this$.$store.state.user._id; });
    var liked = _.findIndex(this.userobj.__like, function(o) { return o.by === this$.$store.state.user._id; });

    if (this.userobj.__love !== undefined && loved >= 0) {
      this.love = 'red';
    }

    if (this.userobj.like !== undefined && liked >= 0) {
      this.like = '#0d47a1';
    }
  },
  methods: {
    loveme() {
      this.love = 'red';
      return loveResource
        .save({ userid: this.userobj._id })
        .then((response) => {
          console.log(response);
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    },
    likeme() {
      this.like = '#0d47a1';
      return likeResource
        .save({ userid: this.userobj._id })
        .then((response) => {
          console.log(response);
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    },
    createChat() {

      //the chat object
      var chat = {
        _id: this.userobj._id,
        username: this.userobj.username,
      };

      chat.avatar = (this.userobj.avatar) ? this.userobj.avatar : ''; //use avatar if available

      chat.messages = []; //empty messages since the chat has just begun
      chat.active = true;
      
      this.$socket.emit('joinRoom', { _id: chat._id });
      this.$store.commit('updateChat', chat);
      // this.$store.commit('activeChat', chat);

      return addFriendResource
        .save(chat)
        .then((response) => {
          console.log(response);
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    },
    imageuploaded(res) {
      this.$store.commit('updateUser', res);
      if (res.errcode === 0) {
        this.src = '';
      }
    },
    imageuploading(res) {
      console.info('uploading');
      console.log(res);
    },
    imageerror(err) {
      console.error(err);
    },
  }
});
