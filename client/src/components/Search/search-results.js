import Vue from 'vue';
import template from './search-results.html';

export default Vue.component('search-results', {
  template: template,
  props: [
    'users'
  ],
  methods: {
    check() {
      console.log(this.users);
    }
  }
});
