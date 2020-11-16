<template>
  <table
    class="ai-table__body border-right"
    cellpadding="0"
    cellspacing="0"
    border="0"
    :style="{width: layout.tableWidth}"
  >
    <colgroup>
      <col v-if="operable" width="30px">
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
        @click="handlerCellClick($event, rowIndex, columnIndex)"
      >
        <input
          v-if="cellClickIndex.rowIndex === rowIndex && cellClickIndex.columnIndex === columnIndex"
          :class="[
            'ai-table__body__input',
            {'ai-table__input-money': columns[columnIndex].type === TABLE_CELL_TYPE_MAP.MONEY},
            {'pr30': columns[columnIndex].tip},
            ]"
          ref="ai-table__body__input"
          autofocus
          type="text"
          :value="column"
          :style="{display: column ? 'table-cell' : 'block'}"
          @keydown="handlerCellInputKeydown($event, columns[columnIndex].type)"
          @keyup="handlerCellInputKeyup($event, columns[columnIndex].type)"
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
            <div
              :class="[
                'ai-table__money-text',
                 {'letter-space-none': column.length > 11},
                 {'red': column.includes('-')}
                ]"
              :style="{width: columns[columnIndex].width, display: column ? 'table-cell' : 'block'}"
            >
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
import { KEY_TYPE, MONEY_UNIT_LIST, TABLE_CELL_TYPE_MAP } from '../constant'
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
    this.store.states.rowDataMap = this.rowDataMap
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
    handlerCellClick ($event, rowIndex, columnIndex) {
      this.store.states.cellClickIndex = { rowIndex, columnIndex }

      this.$nextTick(() => {
        this.$refs['ai-table__body__input'][0].focus()
      })

      this.$emit('cell-click', $event, rowIndex, columnIndex)
    },
    handlerCellInputEnter (e, type) {
      let value = e.target.value
      let val = ''
      if (type === this.TABLE_CELL_TYPE_MAP.MONEY) {

        val = Number(value).toFixed(2)

        const splits = val.split('.')

        // 对 0 的处理
        if (splits[0] === '0') {
          val = splits[1]
          if (val === '00') {
            val = '0'
          }
        }

      } else {
        val = value
      }
      const { rowIndex, columnIndex } = this.cellClickIndex
      this.store.states.data[rowIndex][this.rowDataMap[columnIndex]] = val
      this.store.states.cellClickIndex = { rowIndex: -1, columnIndex: -1 }
    },
    handlerCellInputKeydown (e, type) {
      this.inputInterception(e, type, KEY_TYPE.DOWN)
    },
    handlerCellInputKeyup (e, type) {
      this.inputInterception(e, type, KEY_TYPE.UP)
    },
    inputInterception(e, type, keyType) {
      const whiteList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.', 'Backspace']
      const BackspaceKeyCode = 8

      const { key, keyCode, target } = e
      let val = ''

      if (keyCode === BackspaceKeyCode) {
        val = target.value.substring(0, target.value.length - 1)
      } else {
        val = target.value + key
      }

      const points = val.match(new RegExp(/\./g))
      const hasRightPoint = (!points || points.length === 1)

      let hasRightOperator = false
      const operators = val.match(new RegExp(/-/g))

      if (operators && operators.length === 1) {
        hasRightOperator = val.indexOf('-') === 0
      } else if (!operators){
        hasRightOperator = true
      }

      const { rowIndex, columnIndex } = this.cellClickIndex

      if (type === this.TABLE_CELL_TYPE_MAP.MONEY) {
        if ((!whiteList.includes(key) && keyCode !== BackspaceKeyCode) || !hasRightPoint || !hasRightOperator) {
          e.preventDefault()
        } else {
          if (keyType === KEY_TYPE.UP) {
            this.store.states.data[rowIndex][this.rowDataMap[columnIndex]] = e.target.value
          }
        }
      } else {
        this.store.states.data[rowIndex][this.rowDataMap[columnIndex]] = e.target.value
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";
@import "../style/transition";

.ai-table__body {

  .ai-table__cell {
    text-align: left;
  }

  .el-table__body__row {
    transition: all 0.3s ease;

    &:hover {
      background-color: #eeeeee;
    }
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
    padding-left: 10px;
  }
}
</style>
