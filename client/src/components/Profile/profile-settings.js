import Vue from 'vue';
import { Chrome } from 'vue-color';
import template from './profile-settings.html';

import { profileKeyDetailsResource } from 'src/helpers/resources';

export default Vue.component('profile-settings', {
  template: template,
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      background: this.$store.state.user.background,
      colors: { hex: this.$store.state.user.background },
      updated: false
    };
  },
  updated() {
    //hack because the store isn't set when this view renders
    var user = this.$store.state.user;
    if (this.updated === false && user.background !== '') {
      this.background = user.background;
      this.colors.hex = user.background;

      this.updated = true;
    }

  },
  methods: {
    onChange(colour) {
      this.background = colour.hex;
    },
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll();

      if (!this.errors.any()) { //process the form
        var personal_details = {
          background: this.background
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
