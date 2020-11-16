import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      states: {
        // 渲染的数据来源，是对 table 中的 data 过滤排序后的结果
        data: [],
        _data: [],
        // 不可响应的
        _columns: [],
        originColumns: [],
        columns: [],
        allColumns: [],
        fixedColumns: [],
        rightFixedColumns: [],
        leafColumns: [],
        fixedLeafColumns: [],
        rightFixedLeafColumns: [],
        leafColumnsLength: 0,
        fixedLeafColumnsLength: 0,
        rightFixedLeafColumnsLength: 0,
        initRows: 0,
        operable: false,
        rowMouseEnterIndex: false,
        cellClickIndex: {rowIndex: -1, columnIndex: -1},
        showSummary: false,
        summaryText: '合计',
        summaryData: [],
        rowDataMap: [],
      }
    }
  },
  methods: {

  }
})
