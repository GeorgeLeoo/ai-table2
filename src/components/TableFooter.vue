<template>
  <table
    v-if="store.states.showSummary"
    class="ai-table__footer border-right summary"
    cellpadding="0"
    cellspacing="0"
    border="0"
    :style="{width: layout.tableWidth}"
  >
    <colgroup>
      <col v-if="layout.operable" width="30px">
      <col
        v-for="row in columns"
        :key="row.key"
        :width="row.width"
      >
    </colgroup>
    <tfoot>
    <tr
      class="el-table__footer__row summary"
    >
      <td v-if="layout.operable" class="ai-table__operation summary">
        <div class="ai-table__operation-inner"></div>
      </td>

      <td
        v-for="(column, columnIndex) in summaryData"
        :key="columnIndex"
        :class="[
          'ai-table__column',
          'summary',
          'border-bottom',
          column.value ? 'border-left': 'border-left-transparent',
          {'money-bg': column.type === TABLE_CELL_TYPE_MAP.MONEY},
        ]"
        :style="{width: column.width}"
      >
        <template>
          <!--  type 不为 money      -->
          <div
            v-if="column.type !== TABLE_CELL_TYPE_MAP.MONEY"
            :class="[
              'ai-table__cell',
              'summary-text',
              {'ai-table__cell-pr30': columns.tip},
              ]"
            :style="{width: column.width, display: 'table-cell'}">
            {{column.value}}
          </div>

          <!--  type 为 money      -->
          <div
            v-else
            :class="[
            'ai-table__cell',
            'summary',
            {'money-cell': column.type === TABLE_CELL_TYPE_MAP.MONEY}
          ]"
            :style="{width: column.width, display: column.value ? 'table-cell' : 'block'}">
            <div
              :class="[
                'ai-table__money-text',
                'summary',
                 {'letter-space-none': column.value.length > 11},
                 {'red': column.value.includes('-')}
                ]"
              :style="{width: column.width, display: column.value ? 'table-cell' : 'block'}"
            >{{column.value | formatMoney}}</div>
          </div>
        </template>
      </td>
    </tr>
    </tfoot>
  </table>
</template>
<script>
import { mapStates } from '../store/helper'
import { parseNumber } from '../utils'
import { TABLE_CELL_TYPE_MAP } from '../constant'
import { debounce, throttle } from 'throttle-debounce';


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
      summaryData: [],
    }
  },
  computed: {
    ...mapStates({
      columns: 'columns',
      rowDataMap: 'rowDataMap',
      originColumns: 'originColumns',
      data: 'data',
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
      handler () {
        // this.debounceTraverseToSummaryData()
        this.summaryData = this.traverseToSummaryData()
      }
    }
  },
  filters: {
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  methods: {
    initData () {
      this.summaryData = this.traverseToSummaryData()
      this.store.states.summaryData = this.summaryData
    },
    debounceTraverseToSummaryData() {
      return throttle(300, () => {
        this.summaryData = this.traverseToSummaryData()
      })
    },
    traverseToSummaryData () {
      let data = this.columns
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
            value = sum / 100 + ''
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
  .summary-text {
    font-weight: bold;
  }
}
</style>
