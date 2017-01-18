import Vue from 'vue';
import datepicker from 'vue-datepicker';
import Multiselect from 'vue-multiselect';

import template from './profile-main.html';

import { profileKeyDetailsResource } from 'src/helpers/resources';
import { countries } from 'src/helpers/countries';

export default Vue.component('profile-main', {
  template: template,
  components: {
    Multiselect,
    'date-picker': datepicker
  },
  data() {
    return {
      first_name: '',
      last_name: '',
      speak_english: 'Okay',
      options_english: [
        'Not the best',
        'Okay',
        'Pretty good',
        'Good',
        'Fluent'
      ],
      have_children: false,
      want_children: false,
      age: 16,
      updated: false, //use this as a hack
      biography: '',
      country: null,
      options: countries,
      religion: '',
      //datepicker option
      option: {
        type: 'day',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'YYYY-MM-DD',
        placeholder: 'Date of birth',
        inputStyle: {
          'display': 'inline-block',
          'padding': '6px',
          'line-height': '22px',
          'font-size': '16px',
          'border': '2px solid #fff',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          'border-radius': '2px',
          'color': '#5F5F5F'
        },
        color: {
          header: '#ccc',
          headerText: '#f00'
        },
        buttons: {
          ok: 'Ok',
          cancel: 'Cancel'
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      },
      dob: {
        time: ''
      },
      firstNameError: '',
      lastNameError: '',
    };
  },
  updated() {
    //hack because the store isn't set when this view renders
    if (this.$store.state.user._id !== '' && this.updated === false) {
      var user = this.$store.state.user;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.height = user.height;
      this.weight = user.weight;
      this.speak_english = user.speak_english;
      this.have_children = user.have_children;
      this.want_children = user.want_children;
      this.biography = user.biography;
      this.age = user.age;
      this.country = user.country;
      this.dob.time = user.dob;
      this.religion = user.religion;
      console.log('running updated');
      this.updated = true;
    }
  },
  methods: {
    updateSelected(newSelected) {
      this.country = newSelected;
    },
    updateSpeakEnglish(newSelected) {
      this.speak_english = newSelected;
    },
    submit(e) {
      e.preventDefault();
      this.$validator.validateAll();

      if (!this.errors.any()) { //process the form
        var personal_details = {
          first_name: this.first_name,
          last_name: this.last_name,
          height: this.height,
          weight: this.weight,
          speak_english: this.speak_english,
          have_children: this.have_children,
          want_children: this.want_children,
          profile_pic: this.profile_pic,
          age: this.age,
          country: this.country,
          dob: this.dob,
          religion: this.religion,
          biography: this.biography
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
    lastNameOverflow(isOverflow) {
      this.lastNameError = isOverflow ? 'No more than 20 characters!' : '';
    },
    firstNameOverflow(isOverflow) {
      this.firstNameError = isOverflow ? 'No more than 20 characters!' : '';
    }
  }
});
