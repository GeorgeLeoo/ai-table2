<template>
  <table
    class="ai-table__header border-right"
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
    <thead>
    <tr
      v-for="(row, rowIndex) in originColumns"
      :key="rowIndex"
      class="ai-table__row ai-table__header__row"
    >
      <th v-if="operable" class="ai-table__operation ai-table__header__key">
        <div class="ai-table__operation-inner ai-table__header__key"></div>
      </th>
      <th
        v-for="(column, colIndex) in row"
        :key="colIndex"
        :colspan="column.colSpan"
        :rowspan="column.rowSpan"
        :style="{width: column.width}"
        class="ai-table__column border-left border-bottom ai-table__header__key"
        :class="[ {'border-top': column.level === 1 }]"
      >
        <div
          class="ai-table__cell ai-table__header__key"
        >
          <div class="ai-table__cell-text ai-table__header__key">
            {{column.label}}
            <img
              v-if="column.help && Object.keys(column.help).length > 0"
              class="ai-table__cell-help-icon ai-table__header__key"
              src="../assets/help.png"
              alt=""
              @click="handlerHelpClick($event, rowIndex, colIndex)"
            >
          </div>
          <div
            v-if="column.type === TABLE_CELL_TYPE_MAP.MONEY"
            class="ai-table__money-unit border-top ai-table__header__key"
          >
                <span
                  v-for="(unit, unitIndex) in MONEY_UNIT_LIST"
                  :key="unitIndex"
                  class="ai-table__money-unit__item ai-table__header__key"
                >{{unit}}</span>
          </div>
        </div>
      </th>
    </tr>
    </thead>
  </table>
</template>
<script>
import { mapStates } from '../store/helper'
import { TABLE_CELL_TYPE_MAP, MONEY_UNIT_LIST } from '../constant'

export default {
  name: 'AiTableHeader',
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
      MONEY_WIDTH: 220
    }
  },
  computed: {
    ...mapStates({
      columns: 'columns',
      originColumns: 'originColumns',
      operable: 'operable',
    }),
  },
  watch: {
  },
  created () {},
  mounted () {},
  methods: {
    handlerHelpClick(e, rowIndex, colIndex) {
      this.$emit('help', e, rowIndex, colIndex)
    },
  }
}
</script>

<style scoped lang="scss">
@import "../style/table";

.ai-table__header {

  .ai-table__cell {
    padding: 0;
  }

  .ai-table__money-unit {
    background: url("../assets/money_bg.png") repeat-y;
    font-size: 0;
    height: 22px;
    line-height: 22px;
    text-align: right;
    box-sizing: border-box;

    .ai-table__money-unit__item {
      float: left;
      display: inline;
      width: 17px;
      height: 100%;
      margin-right: 3px;
      background-color: #fff;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .ai-table__cell {
    height: auto;
  }

  .ai-table__cell__tip-text {
    vertical-align: middle;
  }

  .ai-table__cell-help-icon {
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-top: -2px;
    cursor: pointer;
  }
}
</style>
