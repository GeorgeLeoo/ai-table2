<template>
  <table
    class="ai-table__body border-right"
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
    <tbody>
    <tr
      v-for="(row, rowIndex) in tableData"
      :key="rowIndex"
      class="el-table__body__row"
      @mouseenter="handlerRowMouseEnter(rowIndex)"
    >
      <td v-if="layout.operable" class="ai-table__operation">
        <div class="ai-table__operation-inner">
          <template v-if="rowMouseEnterIndex === rowIndex">
            <img class="ai-table__operation-inner__icon" src="../assets/add.png" alt=""
                 @click="handlerAddRow(rowIndex)">
            <img class="ai-table__operation-inner__icon" src="../assets/del.png" alt=""
                 @click="handlerRemoveRow(rowIndex)">
          </template>
        </div>
      </td>
      <template v-for="(column, columnIndex) in row">

        <td
          v-if="columns[columnIndex]"
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
            :style="{display: 'table-cell'}"
            @keydown="handlerCellInputKeydown($event, columns[columnIndex].type)"
            @keyup="handlerCellInputKeyup($event, columns[columnIndex].type)"
            @keyup.enter="handlerCellInputEnter($event, columns[columnIndex].type)"
          >
          <!--          :style="{display: column ? 'table-cell' : 'block'}"-->

          <template v-else>
            <!--  type 不为 money      -->
            <div
              v-if="columns[columnIndex].type !== TABLE_CELL_TYPE_MAP.MONEY"
              :class="[
              'ai-table__cell',
              {'ai-table__cell-pr30': columns[columnIndex].tip},
              ]"
              :style="{width: columns[columnIndex].width, display: 'table-cell'}">
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
      </template>
    </tr>
    </tbody>
  </table>
</template>
<script>
import { KEY_TYPE, MONEY_UNIT_LIST, TABLE_CELL_TYPE_MAP } from '../constant'
import { mapStates } from '../store/helper'

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
      TABLE_CELL_TYPE_MAP,
      MONEY_UNIT_LIST,
      MONEY_WIDTH: 220,
      tableData: []
    }
  },
  computed: {
    ...mapStates({
      columns: 'columns',
      rowDataMap: 'rowDataMap',
      originColumns: 'originColumns',
      data: 'data',
      initRows: 'initRows',
      rowMouseEnterIndex: 'rowMouseEnterIndex',
      cellClickIndex: 'cellClickIndex',
    })
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.setTableData(val)
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
    this.setTableData(this.data)
    this.store.commit('setRowDataMap')
  },
  mounted () {},
  methods: {
    /**
     * 设置 tableData
     * 要渲染的表格数据
     * @param {[]}data 数据源
     */
    setTableData (data) {
      this.tableData = this.traverseRowToColumns(data)
    },
    /**
     * 将 源数据 转换为 数组，用于单元格的渲染
     * [
     *  [ '1', 'a', 'v' ],
     *  [ 'b', 'n', 'g' ],
     * ]
     * @param data 数据源
     * @returns {[]}
     */
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
    /**
     * 鼠标进入某一行
     * @param index 选中的行号
     */
    handlerRowMouseEnter (index) {
      this.store.commit('rowMouseEnter', index)
    },
    /**
     * 添加行
     * @param index 行号
     */
    handlerAddRow (index) {
      this.store.commit('addRow', index)
    },
    /**
     * 删除行
     * @param index 行号
     */
    handlerRemoveRow (index) {
      this.store.commit('removeRow', index)
    },
    /**
     * 单元格点击
     * @param $event
     * @param rowIndex
     * @param columnIndex
     */
    handlerCellClick ($event, rowIndex, columnIndex) {
      this.store.commit('setCellClickIndex', { rowIndex, columnIndex })

      this.inputFocus()

      this.$emit('cell-click', $event, rowIndex, columnIndex)
    },
    /**
     * 输入框聚焦
     */
    inputFocus () {
      this.$nextTick(() => {
        this.$refs['ai-table__body__input'][0].focus()
      })
    },
    /**
     * 输入框 回车
     * @param e
     * @param type
     */
    handlerCellInputEnter (e, type) {
      this.store.commit('setData', { e, type })
    },
    /**
     * 输入框 keydown
     * @param e
     * @param type
     */
    handlerCellInputKeydown (e, type) {
      this.store.commit('inputInterception', { e, type, keyType: KEY_TYPE.DOWN })
    },
    /**
     * 输入框 keyup
     * @param e
     * @param type
     */
    handlerCellInputKeyup (e, type) {
      this.store.commit('inputInterception', { e, type, keyType: KEY_TYPE.UP })
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
