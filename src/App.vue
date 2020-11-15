<template>
  <div id="app">
    <ai-table :options="tableOptions"/>
  </div>
</template>

<script>
import Table from './components/Table'
const columns = [
  // {
  //   label: '日期',
  //   prop: 'quantity'
  // },
  // {
  //   label: '配送信息',
  //   prop: 'quantity',
  //   children: [
  //     {
  //       label: '姓名',
  //       prop: 'quantity',
  //     },
  //     {
  //       label: '地址',
  //       prop: 'quantity',
  //       children: [
  //         {
  //           label: '省份',
  //           prop: 'quantity',
  //         },
  //         {
  //           label: '邮编',
  //           prop: 'quantity',
  //         },
  //       ]
  //     },
  //   ]
  // },
  {
    label: '摘要',
    prop: 'abstract',
    // 单元格宽度，money类型 不能设置宽度
    // width: '340px',
    tip: '摘要',
    editable: true,
    help: {
      title: '标题1',
      content: '1是一段内容,这是一段内容,这是一段内容,这是一段内容。',
      theme: 'light'
    }
  },
  {
    label: '会计科目',
    prop: 'subject',
    // width: 240,
    tip: '科目',
    editable: true,
    canSelect: true,
    help: {
      title: '标题',
      content: '是一段内容,这是一段内容,这是一段内容,这是一段内容。',
      theme: 'dark'
    }
  },
  {
    label: '借方金额',
    prop: 'debtorMoney',
    type: 'money',
    fontSize: '14px',
    editable: true,
    editSize: '20px',
    editPosition: 'right',
    summarized: true,
  },
  {
    label: '贷方金额',
    prop: 'creditorMoney',
    type: 'money',
    fontSize: '14px',
    editable: true,
    editSize: '20px',
    editPosition: 'right',
    summarized: true,
  },
]
export default {
  name: 'app',
  components: {
    [Table.name]: Table
  },
  data () {
    return {
      tableOptions: {
        initRows: 5,
        columns,
        operable: true,
        showSummary: true,
        data: [
          {
            abstract: 'nm',
            subject: 'fhyt',
            debtorMoney: '-6',
            creditorMoney: '-66.34',
          },
          {
            abstract: '到那时到那时到那时到那时到那时到那时到那时到那时到那时到那时32到那时到那时到那时到那时到那时到那时到那时到那时',
            subject: '到那时到那时到那时到那时到那时到那时到那时到那时到那时到那时32到那时到那时到那时到那时到那时到那时到那时到那时',
            debtorMoney: '2',
            creditorMoney: '5345.22',
          },
        ]
      }
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 30px;
}

body {
  margin: 0;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
