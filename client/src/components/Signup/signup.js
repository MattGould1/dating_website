import Vue from 'vue';
import template from './signup.html';

import { signupResource } from 'src/helpers/resources';

export default Vue.component('signup', {
  template: template,
  data() {
    return {
      username: '',
      email: null,
      password: '',
      gender: '',
      submit_error: false
    };
  },
  methods: {
    validateForm(e) {
      e.preventDefault();
      this.$validator.validateAll();
      
      if (!this.errors.any()) {

        var signup = {
          username: this.username,
          email: this.email,
          password: this.password,
          gender: this.gender
        };
        
        return signupResource.save(signup).then((response) => {
          if (response.body === false) {
            this.submit_error = true;
          } else {

            console.log(response.body.user);

            this.$store.commit('updateUser', response.body.user);
            this.$store.commit('updateAuthenticated', true);
            this.$store.commit('updateToken', response.body.token);

            localStorage.setItem('id_token', response.body.token);

            Vue.http.headers.common['x-access-token'] = response.body.token;

            this.$socket.emit('authenticate', { token: this.$store.state.token });
            
            this.$router.push({ path: '/profile/me' });
          }

        }, (errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse.status);
        });
      }
      return false;
    }
  }
});
