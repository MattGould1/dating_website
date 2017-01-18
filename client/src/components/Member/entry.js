import Vue from 'vue';
import template from './entry.html';

import UserProfile from 'src/components/Member/user-profile';

import { membersResource } from 'src/helpers/resources';

export default Vue.extend({
  template,
  components: {
    UserProfile
  },
  data() {
    return {
      route: '',
      user: ''
    };
  },
  watch: {
    '$route': 'fetchUser'
  },
  updated() {
    this.route = this.$route.name;
  },
  created() {
    this.route = this.$route.name;
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      const id = this.$route.params.userid;

      if (id !== 'me') {
        //go fetch the users data...
        return membersResource
          .save({ userid: id })
          .then((response) => {

            this.user = response.body[0];

            this.user.thumbnail = 'http://127.0.0.1:8088/uploads/' + response.body[0].profile_pic + '-thumbnail';
            this.user.avatar = 'http://127.0.0.1:8088/uploads/' + response.body[0].profile_pic + '-avatar';

            this.user.profile_pic = 'http://127.0.0.1:8088/uploads/' + response.body[0].profile_pic;
          }, (errorResponse) => {
            console.log(errorResponse);
          });
      } else {
        //go get the data from the store but small hack to add a delay
        var this$ = this;
        setTimeout(function() {
          this$.user = this$.$store.state.user;
        }, 300);
      }
      return false;
    }
  }
});
