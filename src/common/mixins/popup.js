const EVENT_SHOW = 'show'
const EVENT_HIDE = 'hide'

// 用于mixins混入
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    _show() {
      this.visible = true
      this.$emit(EVENT_SHOW)
    },
    _hide() {
      this.visible = false
      this.$emit(EVENT_HIDE)
    }
  }
}
