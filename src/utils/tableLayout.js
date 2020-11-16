import { getStyle, parseWidth } from './index'
import {CELL_WIDTH, TABLE_CELL_TYPE_MAP} from '../constant'

class TableLayout {
  constructor (options) {
    this.table = null
    this.store = null
    this.tableWidth = null
    this.tableHeight = null
    // 表格是够可 添加/删除 行
    this.operable = false

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }

    if (!this.table) {
      throw new Error('table is required for Table Layout')
    }

    if (!this.store) {
      throw new Error('store is required for Table Layout')
    }

    this.resizeTable()
  }

  setTableWidth () {
    this.tableWidth = getStyle(this.table.$refs['ai-table'], 'width')
  }

  resizeTable () {
    window.addEventListener('resize', () => {
      this.setTableWidth()

      this.store.states.originColumns = JSON.parse(JSON.stringify(this.store.states._columns))
      this.updateCellWidth()
    })
  }

  updateCellWidth () {
    this.store.commit('initStore')

    let columns = this.store.states.columns

    // 已占据宽度
    let occupiedWidth = 0
    let occupiedWidthLength = 0

    if (this.operable) {
      occupiedWidth += CELL_WIDTH.OPERABLE
    }

    for (const column of columns) {
      if (column.width) {
        occupiedWidth += parseWidth(column.width)
        occupiedWidthLength++
      } else if (column.type === TABLE_CELL_TYPE_MAP.MONEY) {
        occupiedWidth += CELL_WIDTH.MONEY
        occupiedWidthLength++
      }
    }

    const averageWidth = (parseWidth(this.tableWidth) - occupiedWidth) / (columns.length - occupiedWidthLength) - columns.length - 1

    for (const column of columns) {
      if (!column.width) {
        if (column.type === TABLE_CELL_TYPE_MAP.MONEY) {
          this.table.$set(column, 'width', CELL_WIDTH.MONEY + 'px')
        } else {
          this.table.$set(column, 'width', averageWidth + 'px')
        }
      }
    }
  }
}

export default TableLayout
