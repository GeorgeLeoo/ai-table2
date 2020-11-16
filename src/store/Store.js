import Vue from 'vue';
import {convertToRows, getAllColumns, getUsefulColumns, setColumnIdentity} from "../utils";

export default Vue.extend({
  data() {
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
        cellClickIndex: {rowIndex: -1, columnIndex: -1},
        showSummary: false,
        summaryText: '合计',
        summaryData: [],
        rowDataMap: [],
        allColumns: [],
      }
    }
  },
  methods: {

  }
})

Vue.prototype.mutations = {
  /**
   * 初始化 store ，对一些数据进行处理
   * @param states
   */
  initStore(states) {
    setColumnIdentity(states.originColumns)

    states.allColumns = getAllColumns(states.originColumns)

    states.originColumns = convertToRows(states.originColumns)

    states.columns = getUsefulColumns(states.allColumns)
  },
  setData(states, data) {
    console.log(states, data, 11)
  },
};

Vue.prototype.commit = function(name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};
