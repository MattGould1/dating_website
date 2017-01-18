import Vue from 'vue';
import template from './display-users-grid.html';

export default Vue.component('display-users-grid', {
  template: template,
  props: [
    'users',
    'title'
  ],
  methods: {
    check() {
      
    }
  }
});
