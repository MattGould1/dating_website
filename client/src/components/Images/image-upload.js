import Vue from 'vue';
import template from './image-upload.html';

import { imageUploadResource } from 'src/helpers/resources';

export default Vue.component('image-upload', {
  template: template,
  props: [
    'image_id',
    'submit_i18n',
    'preview_id'
  ],
  data() {
    return {
      picture: {},
      image_ready: false,
    };
  },
  methods: {
    prepare(e) {
      e.preventDefault();

      var parent = this;
      var output = document.getElementById(parent.preview_id);

      this.$validator.validateAll();

      if (parent.errors.any() === false) {

        var input = document.getElementById(this.image_id);
        var file = input.files[0];
        var reader = new FileReader();

        parent.picture.name = file.name;
        parent.picture.size = file.size;
        parent.picture.type = file.type;

        reader.onload = function() {
          var dataURL = reader.result;
          parent.picture.data = dataURL;

          output.src = dataURL;
        };

        parent.image_ready = true;
        reader.readAsDataURL(file);

      } else {
        parent.image_ready = false;
        parent.picture = {};
        output.sc = '#';
      }

    },
    submit(e) {
      e.preventDefault();

      this.$validator.validateAll();

      if (!this.errors.any()) {

        //var image_details = this.picture;
        var data = new FormData();

        data.append('profile_pic', document.getElementById(this.image_id).files[0]);

        return imageUploadResource
          .save(data)
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
