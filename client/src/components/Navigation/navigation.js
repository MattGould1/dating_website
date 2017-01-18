import Vue from 'vue';
import template from './navigation.html';

export default Vue.extend({
  template,
  data() {
    return {
      user_id: 'me',
      thumbnail: '',
      updated: false,
    };
  },
  updated() {
    if (this.$store.state.user && this.updated === false) {
      this.thumbnail = this.$store.state.user.thumbnail;
      this.updated = true;
    }
  },
  methods: {
    logout() {
      this.$store.state.authenticated = false;
      this.$store.state.token = false;

      localStorage.removeItem('id_token');
      window.location.reload();
      this.$router.push({ path: '/' });
    }
  }
});
