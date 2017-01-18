import Vue from 'vue';
import template from './profile-appearance.html';

import { profileKeyDetailsResource } from 'src/helpers/resources';

export default Vue.component('profile-appearance', {
  template: template,
  components: {
  },
  data() {
    return {
      height: null,
      weight: null,
      profile_pic: '',
      updated: false
    };
  },
  created() {
    console.log(this.$store.state.user);
  },
  updated() {
    //hack because the store isn't set when this view renders
    if (this.$store.state.user._id !== '' && this.updated === false) {
      var user = this.$store.state.user;

      this.height = user.height;
      this.weight = user.weight;

      this.updated = true;
    }
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll();

      if (!this.errors.any()) { //process the form
        var personal_details = {
          height: this.height,
          weight: this.weight,
        };
        console.log(personal_details);
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
