import Vue from 'vue';
import template from './user-profile.html';

import { commentResource } from 'src/helpers/resources';

import userSidebar from 'src/components/Member/user-sidebar';
import userAppBar from 'src/components/Member/user-appbar';
import viewerjs from 'src/helpers/gallery';

export default Vue.extend({
  template: template,
  props: [
    'route',
    'user'
  ],
  components: {
    userSidebar,
    userAppBar
  },
  data() {
    return {
      comment: '',
      dismiss: false,
      gallery: true,
    };
  },
  updated() {
    if (document.getElementById('slider') && this.gallery === true) {
      var options = {
        interval: 3000,
        url: 'original'
      };

      var viewer = new viewerjs(document.getElementById('slider'), options);
      console.log(viewer);

      this.gallery = false; //only run once
    }
  },
  methods: {
    postComment(e) {
      e.preventDefault();
      this.$validator.validateAll();
      if (!this.errors.any()) {
        //user idea is the current store
        var comment = {
          currentUser: this.$store.state.user._id,
          username: this.$store.state.user.username,
          avatar: this.$store.state.user.avatar,
          userid: this.user._id,
          comment: this.comment
        };

        this.comment = '';

        return commentResource
          .save(comment)
          .then((response) => {
            this.user._comments.push(response.body);
          }, (errorResponse) => {
            console.log(errorResponse);
          });
      }

      return false;
    },
    dismissMe() {
      this.dismiss = true;
      return false;
    }
  }
});
