<template>
  <table
    v-if="store.states.showSummary"
    class="ai-table__footer border-right"
    cellpadding="0"
    cellspacing="0"
    border="0"
    :style="{width: layout.tableWidth}"
  >
    <colgroup>
      <col v-if="operable" width="30px">
      <col
        v-for="(row, index) in summaryData"
        :key="index"
        :width="row.width"
      >
    </colgroup>
    <tfoot>
    <tr
      class="el-table__body__row"
    >
      <td v-if="operable" class="ai-table__operation">
        <div class="ai-table__operation-inner"></div>
      </td>

      <td
        v-for="(column, columnIndex) in summaryData"
        :key="columnIndex"
        :class="[
          'ai-table__column',
          'border-bottom',
          {'money-bg': column.type === TABLE_CELL_TYPE_MAP.MONEY},
          {'border-left': column.value}
        ]"
        :style="{width: column.width}"
      >
        <template>
          <!--  type 不为 money      -->
          <div
            v-if="column.type !== TABLE_CELL_TYPE_MAP.MONEY"
            :class="[
              'ai-table__cell',
              {'ai-table__cell-pr30': columns.tip},
              ]"
            :style="{width: column.width, display: column ? 'table-cell' : 'block'}">
            {{column.value}}
          </div>

          <!--  type 为 money      -->
          <div
            v-else
            :class="[
            'ai-table__cell',
            {'money-cell': column.type === TABLE_CELL_TYPE_MAP.MONEY}
          ]"
            :style="{width: column.width, display: column.value ? 'table-cell' : 'block'}">
            <div
              :class="[
                'ai-table__money-text',
                 {'letter-space-none': column.value.length > 11},
                 {'red': column.value.includes('-')}
                ]"
              :style="{width: column.width, display: column.value ? 'table-cell' : 'block'}"
            >
              {{column.value | formatMoney}}
            </div>
          </div>
        </template>

        <!--  tip 区域      -->
<!--        <div-->
<!--          class="ai-table__cell__tip">-->
<!--          <span class="ai-table__cell__tip-text">{{column.tip}}</span>-->
<!--        </div>-->
      </td>
    </tr>
    </tfoot>
  </table>
</template>
<script>
import { mapStates } from '../store/helper'
import { convertToRows, getAllColumns, getColumnsByColSpan, parseNumber } from '../utils'
import { TABLE_CELL_TYPE_MAP } from '../constant'
import { isArray } from '../utils/dataType'

export default {
  name: 'AiTableFooter',
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
      TABLE_CELL_TYPE_MAP,
      MONEY_WIDTH: 220,
      columns: [],
      summaryData: [],
      columnRows: [],
      allColumns: [],
      rowDataMap: {},
    }
  },
  computed: {
    ...mapStates({
      originColumns: 'originColumns',
      data: 'data',
      operable: 'operable',
      rowMouseEnterIndex: 'rowMouseEnterIndex',
      cellClickIndex: 'cellClickIndex',
    })
  },
  watch: {
    originColumns: {
      deep: true,
      handler () {
        this.initData()
      }
    },
    data: {
      deep: true,
      handler (val) {
        this.summaryData = this.traverseToSummaryData()
      }
    }
  },
  filters: {
    formatMoney (val) {
      val = val.replaceAll('.', '')
      val = val.replaceAll('-', '')
      val = val.replaceAll('-0', '')
      if (val[0] && val[0] === '0') {
        val = val.substring(1, val.length)
      }
      return val
    }
  },
  created () {
    this.initData()
    this.rowDataMap = this.setRowDataMap(this.data)
  },
  mounted () {
    this.$nextTick(() => {
      this.layout.updateCellWidth(this.columns, this.MONEY_WIDTH)
    })
  },
  methods: {
    setRowDataMap (data) {
      let result = {}
      if (isArray(data) && data.length > 0) {
        const keys = Object.keys(data[0])
        keys.forEach((column, index) => {
          result[index] = column
        })
      }
      return result
    },
    initData () {
      this.columnRows = convertToRows(this.originColumns, this.columns)
      this.columns = getColumnsByColSpan(this.columnRows, 1)
      this.allColumns = getAllColumns(this.originColumns)
      this.summaryData = this.traverseToSummaryData()
      this.store.states.summaryData = this.summaryData
    },
    traverseToSummaryData () {
      let data = this.allColumns
      const result = []
      data.forEach((row, rowIndex) => {
        let summarized = row.summarized
        let value = ''
        if (rowIndex === 0) {
          value = this.store.states.summaryText
        } else {
          if (summarized) {
            let sum = 0
            this.data.forEach(item => {
              sum += parseNumber(item[row.prop])
            })
            value = sum + ''
          }
        }
        result.push({
          tip: row.tip,
          type: row.type,
          width: row.width,
          colSpan: row.colSpan,
          rowSpan: row.rowSpan,
          prop: row.prop,
          value
        })
      })
      return result
    }
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";

.ai-table__footer {
  .ai-table__cell {
    text-align: left;
  }
}
</style>
