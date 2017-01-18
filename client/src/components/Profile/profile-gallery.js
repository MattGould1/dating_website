import Vue from 'vue';
import template from './profile-gallery.html';

import VueCoreImageUpload from 'vue2.x-core-image-upload';

import { deleteImageResource } from 'src/helpers/resources';

export default Vue.component('profile-gallery', {
  template,
  data() {
    return {
      gallery: [],
      updated: false
    };
  },
  created() {
    var user = this.$store.state.user;
    this.gallery = user.gallery;
    console.log('hmmmm');
  },
  components: {
    'vue-core-image-upload': VueCoreImageUpload
  },
  methods: {
    imageuploaded(res) {
      console.log(res);
      this.gallery.unshift(res);
    },
    imageuploading(res) {
      console.info('uploading');
      console.log(res);
    },
    imageerror(err) {
      console.error(err);
    },
    deleteImage(id) {
      return deleteImageResource
        .save({ _id: id })
        .then((response) => {
          console.log(response);
          console.log(id);
          console.log('delete');
          document.getElementById(id).remove();
        }, (errorResponse) => {
          console.log(errorResponse);
        });
    }
  }
});
