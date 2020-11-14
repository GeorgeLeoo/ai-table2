<template>
  <table
    class="ai-table__body border-right"
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
    <tbody>
    <tr
      v-for="(row, rowIndex) in tableData"
      :key="rowIndex"
      class="el-table__body__row"
      @mouseenter="handlerRowMouseEnter(rowIndex)"
    >
      <td v-if="operable" class="ai-table__operation">
        <div class="ai-table__operation-inner">
          <template v-if="rowMouseEnterIndex === rowIndex">
            <img class="ai-table__operation-inner__icon" src="../assets/add.png" alt=""
                 @click="handlerAddRow(rowIndex)">
            <img class="ai-table__operation-inner__icon" src="../assets/del.png" alt=""
                 @click="handlerRemoveRow(rowIndex)">
          </template>
        </div>
      </td>
      <td
        v-for="(column, columnIndex) in row"
        :key="columnIndex"
        :class="[
          'ai-table__column',
          'border-left',
          'border-bottom',
          {'money-bg': columns[columnIndex].type === TABLE_CELL_TYPE_MAP.MONEY},
        ]"
        :style="{width: columns[columnIndex].width}"
        @click="handlerCellClick(rowIndex, columnIndex)"
      >
        <input
          v-if="cellClickIndex.rowIndex === rowIndex && cellClickIndex.columnIndex === columnIndex"
          :class="[
            'ai-table__body__input',
            {'ai-table__body__input-money': columns[columnIndex].type === TABLE_CELL_TYPE_MAP.MONEY},
            {'pr30': columns[columnIndex].tip},
            ]"
          ref="ai-table__body__input"
          autofocus
          type="text"
          :value="column"
          :style="{width: columns[columnIndex].width, display: column ? 'table-cell' : 'block'}"
          @keyup="handlerCellInputKeyup($event, columns[columnIndex].type)"
          @keydown="handlerCellInputKeydown($event, columns[columnIndex].type)"
          @keyup.enter="handlerCellInputEnter($event, columns[columnIndex].type)"
        >

        <template v-else>
          <!--  type 不为 money      -->
          <div
            v-if="columns[columnIndex].type !== TABLE_CELL_TYPE_MAP.MONEY"
            :class="[
            'ai-table__cell',
            {'ai-table__cell-pr30': columns[columnIndex].tip},
            ]"
            :style="{width: columns[columnIndex].width, display: column ? 'table-cell' : 'block'}">
            {{column}}
          </div>

          <!--  type 为 money      -->
          <div
            v-else
            :class="[
            'ai-table__cell',
            {'money-cell': columns[columnIndex].type === TABLE_CELL_TYPE_MAP.MONEY}
          ]"
            :style="{width: columns[columnIndex].width, display: column ? 'table-cell' : 'block'}">
            <div :class="[
            'ai-table__money-text',
             {'letter-space-none': column.length > 11},
             {'red': column.includes('-')}
            ]">
              {{column | formatMoney}}
            </div>
          </div>
        </template>

        <!--  tip 区域      -->
        <div
          v-if="rowMouseEnterIndex === rowIndex"
          class="ai-table__cell__tip">
          <span class="ai-table__cell__tip-text">{{columns[columnIndex].tip}}</span>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script>
import { MONEY_UNIT_LIST, TABLE_CELL_TYPE_MAP } from '../constant'
import { mapStates } from '../store/helper'
import { convertToRows, getColumnsByColSpan, getInitObject } from '../utils'
import { isArray } from '../utils/dataType'

export default {
  name: 'AiTableBody',
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
      MONEY_WIDTH: 220,
      tableData: [],
      rowDataMap: {}
      // rowMouseEnterIndex: -1
    }
  },
  computed: {
    ...mapStates({
      originColumns: 'originColumns',
      data: 'data',
      initRows: 'initRows',
      operable: 'operable',
      rowMouseEnterIndex: 'rowMouseEnterIndex',
      cellClickIndex: 'cellClickIndex',
    }),
    // tableData() {
    //   return this.getTableData()
    // }
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
        this.tableData = this.traverseRowToColumns(val)
      }
    }
  },
  filters: {
    formatMoney (val) {
      val = val.replaceAll('.', '')
      val = val.replaceAll('-', '')
      return val
    }
  },
  created () {
    this.initData()
    this.tableData = this.traverseRowToColumns(this.data)
    this.rowDataMap = this.setRowDataMap(this.data)
  },
  mounted () {
    this.$nextTick(() => {
      this.layout.updateCellWidth(this.columns, this.MONEY_WIDTH)
    })
  },
  methods: {
    setRowDataMap(data) {
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
    },
    traverseRowToColumns (data) {
      let result = []
      data.forEach(row => {
        const keys = Object.keys(row)
        const arr = []
        keys.forEach(key => {
          arr.push(row[key])
        })
        result.push(arr)
      })
      return result
    },
    handlerRowMouseEnter (index) {
      this.store.states.rowMouseEnterIndex = index
    },
    handlerAddRow (index) {
      this.store.states.data.splice(index, 0, getInitObject(this.originColumns))
    },
    handlerRemoveRow (index) {
      this.store.states.data.splice(index, 1)
    },
    handlerCellClick (rowIndex, columnIndex) {
      this.store.states.cellClickIndex = { rowIndex, columnIndex }

      this.$nextTick(() => {
        this.$refs['ai-table__body__input'][0].focus()
      })
    },
    handlerCellInputEnter (e, type) {
      if (type === this.TABLE_CELL_TYPE_MAP.MONEY) {
        let val = e.target.value

        if (!val.includes('.')) {
          val += '.00'
        }

        const { rowIndex, columnIndex } = this.cellClickIndex
        this.store.states.data[rowIndex][this.rowDataMap[columnIndex]] = val
      }
      this.store.states.cellClickIndex = { rowIndex: -1, columnIndex: -1 }
    },
    handlerCellInputKeydown(e, type) {
      const whiteList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '.', 'Backspace']
      const BackspaceKeyCode = 8

      const {key, keyCode, target} = e
      let val = ''

      if (keyCode === BackspaceKeyCode) {
        val = target.value.substring(0, target.value.length - 1)
      } else {
        val = target.value + key
      }

      const points = val.match(new RegExp(/\./g))
      const hasRightPoint = (!points || points.length === 1)

      console.log(hasRightPoint)

      if (type === this.TABLE_CELL_TYPE_MAP.MONEY) {
        if (!whiteList.includes(key) && keyCode !== BackspaceKeyCode && !hasRightPoint) {
          e.preventDefault()
        }
      }
    },
    handlerCellInputKeyup (e, type) {
      // const {key, keyCode, target} = e
      // let val = target.value
      // const points = val.match(new RegExp(/\./g))
      // const hasRightPoint = (!points || points.length === 1)
      //
      // console.log(hasRightPoint)
      if (type === this.TABLE_CELL_TYPE_MAP.MONEY) {
        const { rowIndex, columnIndex } = this.cellClickIndex
        this.store.states.data[rowIndex][this.rowDataMap[columnIndex]] = e.target.value
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";

.ai-table__body {
  .ai-table__cell {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
  }

  .ai-table__cell-pr30 {
    padding-right: 30px;
  }

  .ai-table__cell__tip {
    display: table;
    position: absolute;
    top: 0;
    right: 6px;
    height: 100%;
    font-size: 12px;
    color: #777;
    cursor: pointer;
    user-select: none;
    z-index: 9;

    &:hover {
      color: #333;
      text-decoration: underline;
    }

    .ai-table__cell__tip-text {
      display: table-cell;
      vertical-align: middle;
    }
  }

  .el-table__body__row {
    &:hover {
      background-color: #eeeeee;
    }
  }

  .money-bg {
    background: url("../assets/money_bg.png") repeat-y;
  }

  .money-cell {
    text-align: right;
    padding: 0;
  }

  .ai-table__money-text {
    font-size: 15px;
    overflow: hidden;
    font-weight: bold;
    letter-spacing: 11px;
    position: relative;
    right: -4px;
    height: 24px;
  }

  .letter-space-none {
    letter-spacing: 0;
    right: 5px;
  }

  .ai-table__column {
    position: relative;
  }

  .ai-table__body__input {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    outline: none;
    border: 1px solid #42b983;
    box-sizing: border-box;
    font-size: 14px;
    color: #2E3033;
    font-weight: normal;
  }

  .ai-table__body__input-money {
    font-size: 15px;
    font-weight: bold;
    text-align: right;
  }
}
</style>
