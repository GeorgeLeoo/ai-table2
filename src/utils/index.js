/**
 * 获取所有的列，将嵌套的列变成一层数据
 * @param columns
 * @returns {[]}
 */
export const getAllColumns = (columns) => {
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      result.push(column)
      result.push.apply(result, getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

/**
 * 获得所有有用的列
 * @param columns
 * @returns {[]}
 */
export const getUsefulColumns = (columns) => {
  const result = []
  const usedColumns = []

  const traverse = (column) => {
    if (column.children) {
      column.children.forEach((subColumn) => {
        traverse(subColumn)
      })
    } else if (column.prop) {
      if (!usedColumns.includes(column.key)) {
        usedColumns.push(column.key)
        result.push(column)
      }
    }
  }

  columns.forEach((column) => {
    traverse(column)
  })

  return result
}

/**
 *
 * @param columns
 */
export const setColumnIdentity = (columns) => {
  const prefix = 'column-'
  let count = 0

  const traverse = (column) => {
    if (column.children) {
      column.key = prefix + count++

      column.children.forEach((subColumn) => {
        traverse(subColumn)
      })
    } else {
      column.key = prefix + count++
    }
  }

  columns.forEach((column) => {
    traverse(column)
  })

}

export const convertToRows = (originColumns) => {
  // 最大层级
  let maxLevel = 1

  const traverse = (column, parent) => {
    // 有 父级
    // 当前层级 === 父级层级 + 1
    if (parent) {
      column.level = parent.level + 1
      // 比较出最大层级
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      // 有 children 占 多列
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      // 无 children 占一列
      column.colSpan = 1
    }
  }

  /**
   * 初始时遍历，默认层级为 1
   */
  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)

  allColumns.forEach((column) => {
    // 有 children 时 row 肯定为 1 行
    if (column.children) {
      column.rowSpan = 1
    } else {
      column.rowSpan = maxLevel - column.level + 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}

export const getColumnsByColSpan = (rowColumns, colSpan) => {
  const result = []
  rowColumns.forEach((rows) => {
    rows.forEach(row => {
      if (row.colSpan === colSpan) {
        result.push(row)
      }
    })
  })
  return result
}

export const getStyle = function (ele, attr) {
  if (ele.currentStyle) {
    return ele.currentStyle[attr]
  } else {
    return getComputedStyle(ele)[attr]
  }
}

/**
 * 合并 选项
 * @param defaults
 * @param config
 * @returns {{}}
 */
export function mergeOptions(defaults, config) {
  const options = {}
  let key
  for (key in defaults) {
    options[key] = defaults[key]
  }
  for (key in config) {
    if (hasOwn(config, key)) {
      const value = config[key]
      if (typeof value !== 'undefined') {
        options[key] = value
      }
    }
  }
  return options
}

/**
 * 将宽度转换为整数
 * @param width
 * @returns {number}
 */
export function parseWidth(width) {
  if (width !== undefined) {
    width = width.replace('px', '')
    width = parseInt(width, 10)
    if (isNaN(width)) {
      width = null
    }
  }
  return width
}

/**
 * 将 minWidth 转换为 整数，若无 则80
 * @param minWidth
 * @returns {number}
 */
export function parseMinWidth(minWidth) {
  if (typeof minWidth !== 'undefined') {
    minWidth = parseWidth(minWidth)
    if (isNaN(minWidth)) {
      minWidth = 80
    }
  }
  return minWidth
}

/**
 * 转换 height 为 整数
 * @param height
 * @returns {string|null|number}
 */
export function parseHeight(height) {
  if (typeof height === 'number') {
    return height
  }
  if (typeof height === 'string') {
    if (/^\d+(?:px)?$/.test(height)) {
      return parseInt(height, 10)
    } else {
      return height
    }
  }
  return null
}

export function getInitObject(columns) {
  const result = {}
  for (const item of columns) {
    result[item.prop] = ''
  }
  return result
}

export function parseNumber(val, fix) {
  let times = Math.pow(10, (fix || 4) / 1)
  val = val / 1
  if (isNaN(val)) {
    return 0
  } else {
    return Math.round(val * times) / times
  }
}

export function resetCellClickIndex(states) {
  states.cellClickIndex = { rowIndex: -1, columnIndex: -1 }
}
