<script>
export default {
  name: 'TemplateComponent',
  props: {
    component: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {
  },
  render (createElement) {
    return createElement(this.component)
  }
}
</script>

<style scoped>

</style>
