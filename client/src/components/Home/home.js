import Vue from 'vue';
import template from './home.html';

import Signup from 'src/components/Signup/signup';
import displayUsersGrid from 'src/components/Content/display-users-grid';

import moment from 'moment';
import _ from 'lodash';

//resources
import { recentResource } from 'src/helpers/resources';

export default Vue.extend({
  template,
  components: {
    Signup,
    displayUsersGrid
  },
  data() {
    return {
      users: []
    };
  },
  created() {
    this.recentlyActive();
  },
  methods: {
    recentlyActive() {
      return recentResource
        .save()
        .then((response) => {
          var this$ = this;
          _.forEach(response.body, function(value) {
            value.last_active = moment(value.last_active).fromNow();
            this$.users.push(value);
          });
          //this.users = response.body;
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    }
  }
});
