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
<!--    <div class="ai-table__body-wrapper">-->
<!--      <table-body-->
<!--        :store="store"-->
<!--        :layout="layout"-->
<!--        @cell-click="handlerCellClick"-->
<!--      ></table-body>-->
<!--    </div>-->
<!--    <div class="ai-table__footer-wrapper">-->
<!--      <table-footer-->
<!--        :store="store"-->
<!--        :layout="layout"-->
<!--      ></table-footer>-->
<!--    </div>-->
    <popover :data="help"></popover>
    <ai-select
      :data="selectOptions"
      @select="handlerSelect"
      @loadmore="handlerSelectLoadMore"
      @close="handlerClose"
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
import { getAllColumns, getInitObject } from '../utils'
import TableLayout from '../utils/tableLayout'
import { TABLE_CELL_TYPE_MAP } from '../constant'
import {getSelectData} from "../api";
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
    // let initRows = this.options.initRows

    // const data = this.getTableData(this.options.data, this.options.columns, initRows)

    const store = createStore(this, {
      _columns: this.options.columns,
      originColumns: this.options.columns,
      // allColumns: getAllColumns(this.options.columns),
      showSummary: this.options.showSummary,
      data: this.options.data,
      initRows: this.options.initRows,
      operable: this.options.operable
    })

    // store.commit('initStore')

    const layout = new TableLayout({
      store: store,
      table: this,
      operable: this.options.operable
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
    handlerClose() {
      this.selectOptions = {}
    },
    handlerSelect(item) {
      const {rowIndex, columnIndex} = this.store.states.cellClickIndex
      const rowDataMap = this.store.states.rowDataMap
      this.store.states.data[rowIndex][rowDataMap[columnIndex]] = item.value
      this.$emit('select', item)
    },
    handlerCellClick(e, rowIndex, columnIndex) {
      const el = e.target.getBoundingClientRect()

      this.setSelectData(el, rowIndex, columnIndex)

      this.$emit('cell-click', e, rowIndex, columnIndex)
    },
    setSelectData(el, rowIndex, columnIndex) {
      const { left, top, width, height } = el
      this.selectOptions = Object.assign({left, top, elWidth: width, elHeight: height}, {...this.options.columns[columnIndex].select})
    },
    handlerSelectLoadMore() {
      isFunction(this.selectOptions.loadmore) && this.selectOptions.loadmore()
    },
    getTableData (data, columns, initRows) {
      let result = []
      if (initRows && data.length < initRows) {
        for (let i = 0; i < initRows; i++) {
          if (data[i] && Object.keys(data[i]).length > 0) {
            result.push(data[i])
          } else {
            result.push(getInitObject(columns))
          }
        }
      } else {
        result = data
      }

      return result
    },
    handlerTableMouseLeave () {
      this.store.states.rowMouseEnterIndex = -1
    },
    handlerHelp (e, rowIndex, colIndex) {
      this.help = {}
      const el = e.target.getBoundingClientRect()
      const { left, top, height } = el
      this.help = this.options.columns[colIndex].help
      setTimeout(() => {
        this.help = { ...this.help, top: top + height + 10, left: left }
      }, 100)
    },
  }
}
</script>

<style scoped>

</style>
