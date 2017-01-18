import Vue from 'vue';
import template from './dashboard.html';

import { getLikesResource } from 'src/helpers/resources';

export default Vue.extend({
  template,
  data() {
    return {
      updated: false,
      me: {},
      likes: ''
    };
  },
  computed: {
    id() {
      return this.$store.state.user._id;
    }
  },
  created() {
    this.me.id = this.$store.state.user._id;

    getLikesResource
      .save(this.me)
      .then((response) => {
        console.log(response);
        this.likes = response.body;
      }, (errorResponse) => {
        console.log(errorResponse);
      });
  },
  updated() {
    if (this.$store.state.user._id !== '' && this.updated === false) {

      this.me.id = this.$store.state.user._id;

      getLikesResource
        .save(this.me)
        .then((response) => {
          console.log(response);
          this.likes = response.body;
        }, (errorResponse) => {
          console.log(errorResponse);
        });

      // getLovesResource
      //   .save(this.me)
      //   .then((response) => {

      //   }, (errorResponse) => {

      //   });
      this.updated = true;
    }
  },
  components: {
  },
  methods: {
  }
});
