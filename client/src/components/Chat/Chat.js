import Vue from 'vue';
import template from './Chat.html';

import _ from 'lodash';
import { messageResource, addFriendResource, blockFriendResource } from 'src/helpers/resources';

export default Vue.extend({
  template,
  data() {
    return {
      joined: [],
      showFriends: true
    };
  },
  updated() {
    //my rooms
  },
  created() {
  },
  sockets: {
    sendMessage: function(data) {
      data.index = _.findIndex(this.$store.state.chat, { _id: data._sender });
      if (data.index === -1 && data._sender !== this.$store.state.user._id) { //this means they are not a friend yet
        //the chat object
        var chat = {
          _id: data._sender,
          username: data.username,
          avatar: data.avatar
        };
        chat.unread = 0;
        chat.messages = []; //empty messages since the chat has just begun
        chat.active = false;
        chat.new = true;

        this.$store.commit('updateChat', chat);

        data.index = _.findIndex(this.$store.state.chat, { _id: data._sender });
        this.$store.commit('message', data);
      } else if (data.index >= 0 && data._sender !== this.$store.state.user._id) {
        this.$store.commit('message', data);
      }
    }
  },
  methods: {
    //get all of the rooms this user is currently involved in
    fetchMessages() {
      return false;
    },
    toggleFriends() {
      if (this.showFriends === false) {
        this.showFriends = true;
      } else {
        this.showFriends = false;
      }
    },
    createRoom(id) {
      var index = _.findIndex(this.$store.state.chat, { _id: id });
      var this$ = this;
      this.$store.commit('updateChat', this.$store.state.chat[index]);

      if (this.$store.state.chat[index].messages.length === 0) {
        messageResource
          .save({
            _to: id,
            _sender: this.$store.state.user._id
          })
          .then((response) => {
            _.forEach(response.body, function(value) {
              console.log('hmm');
              console.log(value);
              value.index = _.findIndex(this$.$store.state.chat, { _id: id });

              this$.$store.commit('message', value);
            });
          }, (errorResponse) => {
            console.log(errorResponse);
          });
          //@todo handle the error response
      }
    },
    closeRoom(id) {
      var index = _.findIndex(this.$store.state.chat, { _id: id });

      this.$store.commit('closeChat', index);
    },
    addFriend(id) {
      return addFriendResource
        .save({ _id: id })
        .then((response) => {
          if (response.body === true) {
            document.getElementById('hideme' + id).style.display = 'none';
          }
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    },
    blockFriend(id) {
      var index = _.findIndex(this.$store.state.chat, { _id: id });
      this.$store.commit('deleteChat', index);

      return blockFriendResource
        .save({ _id: id })
        .then((response) => {
          console.log(response);
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    },
    message(id) {
      var input = document.getElementById('message_' + id);

      var data = {
        message: input.value,
        _id: id,
        _sender: this.$store.state.user._id,
        username: this.$store.state.user.username
      };

      if (_.findIndex(this.joined, id) === -1 || id === data._sender) {
        this.joined.push(id);
        this.$socket.emit('joinRoom', { _id: id });
      }

      data.avatar = (this.$store.state.user.avatar) ? this.$store.state.user.avatar : '';
      data.index = _.findIndex(this.$store.state.chat, { _id: id });

      this.$store.commit('message', data);
      this.$socket.emit('message', data);

      input.value = '';
    }
  }
});
