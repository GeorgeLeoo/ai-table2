import Vue from 'vue'
export default {}.install = (Vue, options = {}) => {
  Vue.directive('loadmore', {
    bind (el, binding) {
      // 获取scroll盒子
      const SELECTWRAP_DOM = el.querySelector('.ai-select .ai-select__list')
      SELECTWRAP_DOM.addEventListener('scroll', function () {
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (CONDITION) {
          binding.value()
        }
      })
    }
  })
}
