const actions = {}
export default actions




actions.nuxtServerInit = function (context) {
  this.commit('resetProject')
}