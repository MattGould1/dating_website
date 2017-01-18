import Vue from 'vue';
import template from './profile-wants.html';
import Multiselect from 'vue-multiselect';

import { profileKeyDetailsResource } from 'src/helpers/resources';

export default Vue.component('profile-wants', {
  template: template,
  components: {
    Multiselect
  },
  data() {
    return {
      wants: {
        min_age: 0,
        max_age: 0,
        gender: '',
      },
      options: [
        'Male',
        'Female'
      ],
      updated: false
    };
  },
  updated() {
    //hack because the store isn't set when this view renders
    if (this.$store.state.user._id !== '' && this.updated === false) {
      var user = this.$store.state.user;
      this.wants.min_age = user.wants.min_age;
      this.wants.max_age = user.wants.max_age;
      this.wants.gender = user.wants.gender;

      this.updated = true;
    }
  },
  methods: {
    updateSelected(newSelected) {
      this.wants.gender = newSelected;
    },
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll();

      if (!this.errors.any()) { //process the form
        var personal_details = {
          wants: {
            min_age: this.wants.min_age,
            max_age: this.wants.max_age,
            gender: this.wants.gender
          }
        };

        return profileKeyDetailsResource
          .save(personal_details)
          .then((response) => {
            this.$store.commit('updateUser', response.body);
          }, (errorReponse) => {
            console.log(errorReponse);
          });
      }
      return false;
    }
  }
});
