import Vue from 'vue';
import template from './profile.html';

import ProfileMain from 'src/components/Profile/profile-main';
import ProfileFinancial from 'src/components/Profile/profile-financial';
import ProfileAppearance from 'src/components/Profile/profile-appearance';
import ProfileWants from 'src/components/Profile/profile-wants';
import ProfileSettings from 'src/components/Profile/profile-settings';
import profileGallery from 'src/components/Profile/profile-gallery';

import VueCoreImageUpload from 'vue2.x-core-image-upload';

export default Vue.extend({
  template,
  data() {
    return {
      src: ''
    };
  },
  components: {
    ProfileMain,
    ProfileAppearance,
    ProfileFinancial,
    ProfileWants,
    ProfileSettings,
    profileGallery,
    'vue-core-image-upload': VueCoreImageUpload
  },
  methods: {
    imageuploaded(res) {
      this.$store.commit('updateUser', res);
      if (res.errcode === 0) {
        this.src = '';
      }
    },
    imageuploading(res) {
      console.info('uploading');
      console.log(res);
    },
    imageerror(err) {
      console.error(err);
    }
  }
});
