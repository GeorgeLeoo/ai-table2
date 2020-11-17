<template>
  <transition name="el-zoom-in-top">
    <div v-if="data && data.list" class="ai-select light" :style="style">
      <div
        :class="[
            'ai-select__arrow',
            'light-arrow'
          ]"></div>
      <ul
        v-loadmore="handlerLoadMore"
        class="ai-select__list"
        :style="listStyle"
      >
        <li
          class="ai-select__list-item"
          v-for="(item, index) in list"
          :key="index"
          @click="handlerSelect(item)"
        >
          {{item.value}}
        </li>
      </ul>
      <TemplateComponent
        v-if="this.data && this.data.component"
        :component="this.data.component"
      ></TemplateComponent>
    </div>
  </transition>
</template>
<script>
import TemplateComponent from "./TemplateComponent";

export default {
  name: 'Select',
  components: {
    TemplateComponent
  },
  props: {
    data: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      SlotComponent: null
    }
  },
  computed: {
    style() {
      return {
        left: this.data.left + 'px',
        top: this.data.top + this.data.elHeight + 10 + 'px',
        minWidth: this.data.elWidth + 'px'
      }
    },
    list() {
      return this.data.list
    },
    listStyle() {
      const style = {}
      if (this.data.height) {
        style.maxHeight = this.data.height
      }
      return style
    }
  },
  directives: {
    loadmore(el, binding) {
      el.addEventListener('scroll', function () {
        const condition = (this.scrollHeight - this.scrollTop) <= this.clientHeight
        if (condition) {
          binding.value()
        }
      })
    }
  },
  created() {
    this.SlotComponent = this.data.component
  },
  mounted() {
    window.addEventListener('click', (e) => {
      if (!e.target.className.includes('ai-select') && !e.target.className.includes('ai-table__body__input') && !e.target.className.includes('ai-table__cell')) {
        this.$emit('close')
      }
    })

    window.addEventListener('keyup', (e) => {
      if (this.list && this.list.length > 0 && e.keyCode === 38 || e.keyCode === 40) {

      }
    })
  },
  methods: {
    handlerSelect(item) {
      this.$emit('select', item)
      this.$emit('close')
    },
    handlerLoadMore() {
      this.$emit('loadmore')
    }
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";
@import "../style/transition";

.ai-select {
  position: absolute;
  left: -9999999px;
  top: -9999999px;
  z-index: 999;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  .ai-select__arrow {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: -6px;
    left: 50%;
    margin-right: 3px;
    border-width: 6px;
    border-top-width: 0;

    &::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      content: " ";
      border-width: 6px;
      top: 1px;
      margin-left: -6px;
      border-top-width: 0;

    }
  }

  .light {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  .light-arrow {
    border-bottom-color: #ebeef5;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));

    &::after {
      border-bottom-color: #fff;
    }
  }

  .ai-select__list {
    max-height: 200px;
    overflow: auto;

    .ai-select__list-item {
      margin: 0;
      text-align: left;
      font-size: 14px;
      padding: 8px 20px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #eeeeee;
      }
    }
  }
}
</style>
