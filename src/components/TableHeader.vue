<template>
  <table
    class="ai-table__header border-right"
    cellpadding="0"
    cellspacing="0"
    border="0"
    :style="{width: layout.tableWidth}"
  >
    <colgroup>
      <col v-if="operable" width="30">
      <col
        v-for="row in columns"
        :key="row.label"
        :width="row.width"
      >
    </colgroup>
    <thead>
    <tr
      v-for="(row, rowIndex) in columnRows"
      :key="rowIndex"
      class="ai-table__row"
    >
      <th v-if="operable" class="ai-table__operation">
        <div class="ai-table__operation-inner"></div>
      </th>
      <th
        v-for="(column, colIndex) in row"
        :key="colIndex"
        :colspan="column.colSpan"
        :rowspan="column.rowSpan"
        :style="{width: column.width}"
        class="ai-table__column border-left border-bottom"
        :class="[ {'border-top': column.level === 1 }]"
      >
        <div
          class="ai-table__cell"
          :style="{width: column.width}"
        >
          <div class="ai-table__cell-text">{{column.label}}</div>
          <div
            v-if="column.type === TABLE_CELL_TYPE_MAP.MONEY"
            class="ai-table__money-unit border-top"
            :style="{width: column.width}">
                <span
                  v-for="(unit, unitIndex) in MONEY_UNIT_LIST"
                  :key="unitIndex"
                  class="ai-table__money-unit__item"
                >{{unit}}</span>
          </div>
        </div>
      </th>
    </tr>
    </thead>
  </table>
</template>
<script>
import { mapStates } from '../store/helper'
import { convertToRows, getColumnsByColSpan } from '../utils'
import { TABLE_CELL_TYPE_MAP, MONEY_UNIT_LIST } from '../constant'

export default {
  name: 'AiTableHeader',
  props: {
    store: {
      type: Object,
      default: () => { return {} }
    },
    layout: {
      type: Object,
      default: () => { return {} }
    },
  },
  data () {
    return {
      columnRows: [],
      columns: [],
      TABLE_CELL_TYPE_MAP,
      MONEY_UNIT_LIST,
      MONEY_WIDTH: 220
    }
  },
  computed: {
    ...mapStates({
      originColumns: 'originColumns',
      operable: 'operable',
    }),
  },
  watch: {
    originColumns: {
      deep: true,
      handler () {
        this.columnRows = convertToRows(this.originColumns, this.columns)
        this.columns = getColumnsByColSpan(this.columnRows, 1)
      }
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(() => {
      this.layout.updateCellWidth(this.columns, this.MONEY_WIDTH)
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
@import "../style/table";

.ai-table__header {

  .ai-table__money-unit {
    background: url("../assets/money_bg.png") repeat-y;
    font-size: 0;
    height: 22px;
    line-height: 22px;
    text-align: right;
    box-sizing: border-box;

    .ai-table__money-unit__item {
      float: left;
      display: inline;
      width: 17px;
      height: 100%;
      margin-right: 3px;
      background-color: #fff;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .ai-table__cell {
    height: auto;
  }
}
</style>
