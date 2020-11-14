<template>
  <table
    class="ai-table__footer border-right"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
<!--      <col v-for="row in columns" :key="row.label" :width="row.width">-->
    </colgroup>
    <tfoot>
    <!--    <tr-->
    <!--      v-for="(row, rowIndex) in columnRows"-->
    <!--      :key="rowIndex"-->
    <!--    >-->
    <!--      <td-->
    <!--        v-for="(column, colIndex) in row"-->
    <!--        :key="colIndex"-->
    <!--        :colspan="column.colSpan"-->
    <!--        :rowspan="column.rowSpan"-->
    <!--      >-->
    <!--        <div class="cell">-->
    <!--          {{column.label}}-->
    <!--        </div>-->
    <!--      </td>-->
    <!--    </tr>-->
    </tfoot>
  </table>
</template>
<script>
export default {
  name: 'AiTableFooter',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>
