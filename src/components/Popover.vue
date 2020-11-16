<template>
  <div>
    <transition
      name="fade-in-linear"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave">
      <div
        :class="[
          'ai-popover',
          theme,
          theme + '-text',
        ]"
        ref="ai-popover"
        v-show="showPopper && showPopover"
        :style="popoverStyle"
      >
        <div
          :class="[
            'ai-popover__arrow',
            theme + '-arrow',
          ]"></div>
        <div
          :class="[
          'ai-popover__title',
          theme + '-text'
          ]"
          v-if="title"
          v-text="title"
        ></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <span class="ai-popover__reference-wrapper" ref="wrapper">
      <slot name="reference"></slot>
    </span>
  </div>
</template>
<script>
export default {
  name: 'Popover',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      defaultWidth: '200px',
      showPopover: false,
    }
  },
  computed: {
    showPopper () {
      this.showPopover = Object.keys(this.data).length > 0
      return true
    },
    title () {
      return this.data.title
    },
    content () {
      return this.data.content
    },
    theme () {
      return this.data.theme
    },
    popoverStyle () {
      return this.setPopoverStyle()
    }
  },
  created () {},
  mounted () {
    window.addEventListener('click', (e) => {
      if (!e.target.className.includes('ai-table__cell-help-icon') && !e.target.className.includes('ai-popover')) {
        this.showPopover = false
      }
    })
  },
  destroyed () {
    const reference = this.reference

    // off(reference, 'click', this.doToggle);
    // off(reference, 'mouseup', this.doClose);
    // off(reference, 'mousedown', this.doShow);
    // off(reference, 'focusin', this.doShow);
    // off(reference, 'focusout', this.doClose);
    // off(reference, 'mousedown', this.doShow);
    // off(reference, 'mouseup', this.doClose);
    // off(reference, 'mouseleave', this.handleMouseLeave);
    // off(reference, 'mouseenter', this.handleMouseEnter);
    // off(document, 'click', this.handleDocumentClick);
  },
  methods: {
    setPopoverStyle () {
      const style = {}

      const popoverEl = this.$refs['ai-popover']
      let popoverElWidth = 0
      let popoverElHeight = 0
      if (popoverEl) {
        popoverElWidth = popoverEl.offsetWidth
        popoverElHeight = popoverEl.offsetHeight

        if (this.data.left) {
          style.left = this.data.left - popoverElWidth / 2 + 'px'
        }
        if (this.data.top) {
          style.top = this.data.top + 'px'
        }
      }

      if (this.data.width) {
        style.width = this.data.width
      } else {
        style.width = this.defaultWidth
      }
      return style
    },
    handleAfterEnter () {
      this.$emit('after-enter')
    },
    handleAfterLeave () {
      this.$emit('after-leave')
    },
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";
@import "../style/transition";

.ai-popover {
  position: absolute;
  left: -9999999px;
  top: -9999999px;
  z-index: 999;
  padding: 18px 20px;
  font-size: 12px;
  color: #777777;
  text-align: left;

  .ai-popover__title {
    font-size: 16px;
    text-align: center;
  }

  .ai-popover__arrow {
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

  .light-arrow {
    border-bottom-color: #ebeef5;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));

    &::after {
      border-bottom-color: #fff;
    }
  }

  .dark-arrow {
    border-bottom-color: #696969;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));

    &::after {
      border-bottom-color: #323232;
    }
  }
}


.light {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.dark {
  background-color: #323232;
  border-radius: 4px;
  border: 1px solid #696969;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.light-text {
  color: #333;
}

.dark-text {
  color: #fff;
}

</style>
