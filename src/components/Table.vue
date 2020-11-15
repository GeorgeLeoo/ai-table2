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
      />
    </div>
    <div class="ai-table__body-wrapper">
      <table-body
        :store="store"
        :layout="layout"
      ></table-body>
    </div>
    <div class="ai-table__footer-wrapper">
      <table-footer
        :store="store"
        :layout="layout"
      ></table-footer>
    </div>
  </div>
</template>
<script>
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import { createStore } from '../store/helper'
import { getAllColumns, getInitObject } from '../utils'
import TableLayout from '../utils/tableLayout'
import { TABLE_CELL_TYPE_MAP } from '../constant'

export default {
  name: 'AiTable',
  components: {
    TableHeader,
    TableBody,
    TableFooter,
  },
  props: {
    options: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    let operable = this.options.operable
    let initRows = this.options.initRows

    const data = this.getTableData(this.options.data, this.options.columns, initRows)

    const store = createStore(this, {
      _columns: this.options.columns,
      originColumns: this.options.columns,
      allColumns: getAllColumns(this.options.columns),
      showSummary: this.options.showSummary,
      data,
      _data: data,
      initRows,
      operable
    })

    const layout = new TableLayout({
      store: store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader
    })

    return {
      layout,
      store
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.layout.setTableWidth()
  },
  methods: {
    getTableData (data, columns, initRows) {
      let result = []
      if (data.length < initRows) {
        for (let i = 0; i < initRows; i++) {
          if (data[i] && Object.keys(data[i]).length > 0) {
            result.push(data[i])
          } else {
            result.push(getInitObject(columns))
          }
        }
      } else {
        result = this.data
      }

      return result
    },
    handlerTableMouseLeave() {
      this.store.states.rowMouseEnterIndex = -1
    },
  }
}
</script>

<style scoped>

</style>
