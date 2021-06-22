const actions = {}
export default actions




actions.nuxtServerInit = function (context) {
  global.$state = context.state
  global.$getters = context.getters
  global.$commit = context.commit

  context.commit('resetProject')
}