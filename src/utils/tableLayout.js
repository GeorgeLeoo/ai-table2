import { getStyle, parseWidth } from './index'
import { TABLE_CELL_TYPE_MAP } from '../constant'

class TableLayout {
  constructor (options) {
    this.table = null
    this.store = null
    this.tableWidth = null
    this.tableHeight = null

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
    let originColumns = this.store.states.originColumns
    let _columns = this.store.states._columns

    let MONEY_WIDTH = 220
    let usedWidth = 0
    let usedWidthLength = 0

    for (const column of _columns) {
      if (column.width) {
        usedWidth += parseWidth(column.width)
        usedWidthLength++
      } else if (column.type === TABLE_CELL_TYPE_MAP.MONEY) {
        usedWidth += MONEY_WIDTH
        usedWidthLength++
      }
    }
    const averageWidth = (parseWidth(this.tableWidth) - usedWidth) / (originColumns.length - usedWidthLength) - originColumns.length - 1

    for (const column of originColumns) {
      if (!column.width) {
        if (column.type === TABLE_CELL_TYPE_MAP.MONEY) {
          this.table.$set(column, 'width', MONEY_WIDTH + 'px')
        } else {
          this.table.$set(column, 'width', averageWidth + 'px')
        }
      }
    }
  }
}

export default TableLayout
