import Vue from 'vue';
import template from './profile-financial.html';

import { profileKeyDetailsResource } from 'src/helpers/resources';
import { education } from 'src/helpers/education';

import Multiselect from 'vue-multiselect';

export default Vue.component('profile-financial', {
  template: template,
  components: {
    Multiselect
  },
  data() {
    return {
      education: '',
      options_education: education,
      job: '',
      salary: 0,

      updated: false
    };
  },
  updated() {
    //hack because the store isn't set when this view renders
    if (this.$store.state.user._id !== '' && this.updated === false) {
      var user = this.$store.state.user;

      this.education = user.education;
      this.job = user.job;
      this.salary = user.salary;

      this.updated = true;
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll();

      if (!this.errors.any()) { //process the form
        var personal_details = {
          education: this.education,
          job: this.job,
          salary: this.salary
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
    },
    updateEducation(selected) {
      this.education = selected;
    }
  }
});
