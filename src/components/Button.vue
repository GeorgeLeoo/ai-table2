<template>
  <div @click="handlerClick">
    Button
  </div>
</template>

<script>
export default {
    name: "Button",
    components: {},
    props: {},
    data() {
        return {
          user: '22'
        }
    },
    computed: {},
    watch: {},
    filters: {},
    created() {},
    methods: {
      handlerClick() {
        console.log(111)
      }
    },
}
</script>

<style scoped>
div {
  background: red;
  color: #ffffff;
}
</style>
