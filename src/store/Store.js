import Vue from 'vue'
import {
  convertToRows,
  getAllColumns,
  getInitObject,
  getUsefulColumns,
  resetCellClickIndex,
  setColumnIdentity
} from '../utils'
import { isArray } from '../utils/dataType'
import { KEY_TYPE, TABLE_CELL_TYPE_MAP } from '../constant'

export default Vue.extend({
  data () {
    return {
      states: {
        // 下划线 开头的数据 不可响应
        _data: [],
        _columns: [],
        // 列表个数据
        data: [],
        // 表头列数据，对应 _columns
        originColumns: [],
        // 表头列数据，每一列的数据，不包含父级
        columns: [],
        // 初始表格行数
        initRows: 0,
        // 表格是够可 添加/删除 行
        operable: false,
        rowMouseEnterIndex: false,
        cellClickIndex: { rowIndex: -1, columnIndex: -1 },
        showSummary: false,
        summaryText: '合计',
        summaryData: [],
        rowDataMap: [],
        allColumns: [],
      }
    }
  },
  methods: {}
})

Vue.prototype.mutations = {
  /**
   * 初始化 store ，对一些数据进行处理
   * @param states
   */
  initStore (states) {
    setColumnIdentity(states.originColumns)

    states.allColumns = getAllColumns(states.originColumns)

    states.originColumns = convertToRows(states.originColumns)

    states.columns = getUsefulColumns(states.allColumns)

    states.dataEmptyItem = getInitObject(states.columns)
  },
  setData (states, { e, type }) {
    let value = e.target.value
    let val = ''
    if (type === TABLE_CELL_TYPE_MAP.MONEY) {

      val = Number(value).toFixed(2)

      if (val === '0.00') {
        val = ''
      }

    } else {
      val = value
    }
    const { rowIndex, columnIndex } = states.cellClickIndex
    states.data[rowIndex][states.rowDataMap[columnIndex]] = val

    resetCellClickIndex(states)
  },
  setRowDataMap (states) {
    const data = states.data
    let result = {}
    if (isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0])
      keys.forEach((column, index) => {
        result[index] = column
      })
    }
    states.rowDataMap = result
  },
  rowMouseEnter (states, index) {
    states.rowMouseEnterIndex = index
  },
  addRow (states, index) {
    states.data.splice(index, 0, {...states.dataEmptyItem})
  },
  removeRow (states, index) {
    states.data.splice(index, 1)
  },
  setCellClickIndex (states, data) {
    states.cellClickIndex = data
  },
  inputInterception(states, {e, type, keyType}) {
    const whiteList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.', 'Backspace']
    const BackspaceKeyCode = 8

    const { key, keyCode, target } = e
    let val = ''

    if (keyCode === BackspaceKeyCode) {
      val = target.value.substring(0, target.value.length - 1)
    } else {
      val = target.value
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
    const { rowIndex, columnIndex } = states.cellClickIndex
    if (type === TABLE_CELL_TYPE_MAP.MONEY) {
      if ((!whiteList.includes(key) && keyCode !== BackspaceKeyCode) || !hasRightPoint || !hasRightOperator) {
        e.preventDefault()
      } else {
        if (keyType === KEY_TYPE.UP) {
          states.data[rowIndex][states.rowDataMap[columnIndex]] = e.target.value
        }
      }
    } else {
      states.data[rowIndex][states.rowDataMap[columnIndex]] = e.target.value
    }
  },
  select(states, data) {
    const {rowIndex, columnIndex} = states.cellClickIndex

    const rowDataMap = states.rowDataMap

    states.data[rowIndex][rowDataMap[columnIndex]] = data.value

    resetCellClickIndex(states)
  },
  tableMouseLeave(states) {
    states.rowMouseEnterIndex = -1
  }
}

Vue.prototype.commit = function (name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}
