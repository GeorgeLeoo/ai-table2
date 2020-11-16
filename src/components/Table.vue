<template>
  <div
    class="ai-table"
    ref="ai-table"
    @mouseleave="handlerTableMouseLeave"
  >
    <div class="ai-table__header-wrapper">
      <table-header
        :store="store"
        :layout="layout"
        @help="handlerHelp"
      />
    </div>
    <div class="ai-table__body-wrapper">
      <table-body
        :store="store"
        :layout="layout"
        @cell-click="handlerCellClick"
      ></table-body>
    </div>
    <div class="ai-table__footer-wrapper">
      <table-footer
        :store="store"
        :layout="layout"
      ></table-footer>
    </div>
    <popover :data="help"></popover>
    <ai-select
      :data="selectOptions"
      @select="handlerSelect"
      @loadmore="handlerSelectLoadMore"
      @close="handlerSelectClose"
    ></ai-select>
  </div>
</template>
<script>
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import Popover from './Popover'
import AiSelect from './Select'
import { createStore } from '../store/helper'
import TableLayout from '../utils/tableLayout'
import {isFunction} from "../utils/dataType";

export default {
  name: 'AiTable',
  components: {
    TableHeader,
    TableBody,
    TableFooter,
    Popover,
    AiSelect,
  },
  props: {
    /**
     * 配置项
     */
    options: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {


    const store = createStore(this, {
      _columns: this.options.columns,
      originColumns: this.options.columns,
      showSummary: this.options.showSummary,
      data: this.options.data,
      initRows: this.options.initRows,
      operable: this.options.operable
    })


    const layout = new TableLayout({
      store: store,
      table: this,
      operable: this.options.operable,
      summaryTextSize: this.options.summaryTextSize,
    })

    return {
      layout,
      store,
      help: {},
      selectOptions: {},
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    this.layout.setTableWidth()

    this.$nextTick(() => {
      this.layout.updateCellWidth()
    })
  },
  methods: {
    /**
     * select 关闭事件
     */
    handlerSelectClose() {
      this.selectOptions = {}
    },
    /**
     * select 选择事件
     * @param item
     */
    handlerSelect(item) {
      this.store.commit('select', item)
      this.$emit('select', item)
    },
    /**
     * 输入框点击
     * @param e
     * @param rowIndex
     * @param columnIndex
     */
    handlerCellClick(e, rowIndex, columnIndex) {
      const el = e.target.getBoundingClientRect()

      this.setSelectData(el, rowIndex, columnIndex)

      this.$emit('cell-click', {e, rowIndex, columnIndex, value: e.target.value})
    },
    /**
     * 设置选中的数据
     * @param el
     * @param rowIndex
     * @param columnIndex
     */
    setSelectData(el, rowIndex, columnIndex) {
      const { left, top, width, height } = el
      this.selectOptions = Object.assign({left, top, elWidth: width, elHeight: height}, {...this.options.columns[columnIndex].select})
    },
    /**
     * select 加载更多
     */
    handlerSelectLoadMore() {
      isFunction(this.selectOptions.loadmore) && this.selectOptions.loadmore()
    },
    /**
     * 鼠标离开表格
     */
    handlerTableMouseLeave () {
      this.store.commit('tableMouseLeave')
    },
    /**
     * 帮助按钮
     * @param e
     * @param rowIndex
     * @param colIndex
     */
    handlerHelp (e, rowIndex, colIndex) {
      // this.help = {}
      const el = e.target.getBoundingClientRect()
      const { left, top, height } = el

      this.help = this.options.columns[colIndex].help

      this.$nextTick(() => {
        this.help = { ...this.help, top: top + height + 10, left: left }
      })
    },
  }
}
</script>

<style scoped>

</style>
