import Vue from 'vue';
import template from './search.html';

import Multiselect from 'vue-multiselect';
import { searchResource } from 'src/helpers/resources';
import displayUsersGrid from 'src/components/Content/display-users-grid';
import { countries } from 'src/helpers/countries';
import { education } from 'src/helpers/education';

import moment from 'moment';
import _ from 'lodash';

export default Vue.extend({
  template: template,
  components: {
    displayUsersGrid,
    Multiselect
  },
  data() {
    var user = this.$store.state.user;
    return {
      search_params: {
        gender: user.wants.gender,
        min_age: user.wants.min_age,
        max_age: user.wants.max_age,
        country: user.country,
        height: false,
        education: false,
        have_children: false,
        profile_pic: false,
        online: false
      },
      order_by: {
        last_active: false,
        newest_member: false,
      },
      users: [],
      options: {
        gender: [
          'Male',
          'Female'
        ],
        education: education,
        country: countries
      }
    };
  },
  created() {
    const user = this.$store.state.user;
    var params = {};

    if (user._id !== '') {
      params = {
        min_age: user.wants.min_age,
        max_age: user.wants.max_age,
        country: user.country
      };
    } else {
      params = {
        params: false
      };
    }

    console.log(params);
    this.fetchUsers(params);
  },
  methods: {
    fetchUsers(params) {
      return searchResource
        .save(params)
        .then((response) => {
          var this$ = this;
          _.forEach(response.body, function(value) {
            value.last_active = moment(value.last_active).fromNow();
            this$.users.push(value);
          });
        }, (errorResponse) => {
          console.log(errorResponse);
        });
      //get the last 20 users
      
      // return false;
    },
    //for multiselect
    updateGender(selected) {
      this.search_params.gender = selected;
    },
    updateEducation(selected) {
      this.search_params.education = selected;
    },
    updateCountry(selected) {
      this.search_params.country = selected;
    },
    submit(e) {
      e.preventDefault();
      var key;
      var keys = Object.keys(this.search_params);
      var search = {};
      for (key of keys) {
        search[key] = this.search_params[key];
      }

      this.fetchUsers(search);
    }
  }
});
