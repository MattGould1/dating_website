export const Auth = {};

Auth.install = function(Vue, options) {

  //authenticated?
  var jwt1 = localStorage.getItem('id_token');
  if (jwt1){
    options.store.commit('updateToken', jwt1);
    options.store.commit('updateAuthenticated', true);
  } else {
    options.store.commit('updateAuthenticated', false);
  }

  Vue.CheckAuth = function() {
    //authenticated?
    var jwt = localStorage.getItem('id_token');
    if (jwt){
      options.store.commit('updateToken', jwt);
      options.store.commit('updateAuthenticated', true);
    } else {
      options.store.commit('updateAuthenticated', false);
    }
  };

  //test for authentication
  Vue.ChangeAuth = function(truth) {
    options.store.commit('updateAuthenticated', truth);
  };
};
