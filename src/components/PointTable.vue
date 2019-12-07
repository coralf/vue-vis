<template>
  <div id="point-table">
    <table>
      <tr>
        <th>店名</th>
        <th>类型</th>
        <th>口味</th>
        <th>点评数量</th>
      </tr>
      <tr v-for="item in tableItems" v-bind:key="item.item_id" v-on:mouseover="mouseover(item)">
        <td>{{item.name}}</td>
        <td>{{item.cat_name}}</td>
        <td>{{item.tast}}</td>
        <td>{{item.review_count}}</td>
      </tr>
    </table>
    <div id="page">
      <button @click="lastPage">上一页</button>
      <span>{{page.currentPage}}</span>
      <span>{{page.currentPage+1}}</span>
      <span>{{page.currentPage+2}}</span>
      <span>...</span>
      <button @click="nextPage">下一页</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    points: {
      type: Array
    }
  },
  data() {
    return {
      tableItems: [],
      page: {
        pageCount: 5,
        currentPage: 1,
        index: 0,
        end: 5
      }
    };
  },
  methods: {
    mouseover(item) {
      this.$emit("onTableItemHover", item);
    },
    nextPage() {
      if (this.page.currentPage == Math.ceil(this.points / 5)) {
        this.page.currentPage = Math.ceil(this.points / 5);
        return;
      }
      this.page.index = this.page.currentPage * this.page.pageCount;
      this.page.currentPage++;
      this.page.end = this.page.currentPage * this.page.pageCount;
      this.tableItems = this.points.slice(this.page.index, this.page.end);
    },
    lastPage() {
      if (this.page.currentPage == 1) {
        this.page.currentPage = 1;
        return;
      }
      this.page.currentPage--;
      this.page.index = this.page.currentPage * this.page.pageCount - 5;
      this.page.end = this.page.currentPage * this.page.pageCount;
      this.tableItems = this.points.slice(this.page.index, this.page.end);
    }
  },
  created() {
    this.tableItems = this.points.slice(this.page.index, this.page.end);
  }
};
</script>

<style scoped>
table {
  color: #76c0ff;
  width: 100%;
  border-spacing: 0;
  border-collapse: 0;
  padding: 10px;
  height: 90%;
}
table tr {
  cursor: pointer;
}
table tr th,
td {
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #132f46;
}
table tr:hover {
  background-color: #132f46;
}
#point-table {
  height: inherit;
}
#page {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
#page span {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  color: #76c0ff;
}
#page button {
  background-color: transparent;
  outline: none;
  border: 1px solid #132f46;
  color: #76c0ff;
  border-radius: 2px;
}
</style>