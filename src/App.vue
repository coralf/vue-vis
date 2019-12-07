<template>
  <div id="app">
    <header>
      <div class="title">绵阳餐饮数据可视化</div>
    </header>
    <section>
      <div class="box-map">
        <div class="hook"></div>
        <div class="lb hook"></div>
        <div class="rt hook"></div>
        <div class="rb hook"></div>
        <baidu-map class="map" id="bmap" :center="center" :zoom="zoom" @ready="handler">
          <bm-point-collection
            :points="points"
            shape="BMAP_POINT_SHAPE_CIRCLE"
            :color="pointsColor"
            size="BMAP_POINT_SIZE_NORMAL"
            @click="clickHandler"
          ></bm-point-collection>
          <bm-marker :position="point" :dragging="true"></bm-marker>
          <bml-heatmap :data="heatMapdata" :max="200" :radius="15"></bml-heatmap>
        </baidu-map>
      </div>
    </section>
    <footer>
      <div class="chart-box">
        <div class="box-pipe chart-bg">
          <div class="hook"></div>
          <div class="lb hook"></div>
          <div class="rt hook"></div>
          <div class="rb hook"></div>
          <div id="pipe"></div>
        </div>
        <div class="box-circle chart-bg">
          <point-table v-bind:points="points" @onTableItemHover="onTableItemHover"></point-table>
        </div>
        <div class="box-hit chart-bg">
          <div class="hook"></div>
          <div class="lb hook"></div>
          <div class="rt hook"></div>
          <div class="rb hook"></div>
          <div id="hit"></div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import { utilCityCenter, baiduMapLayer, DataSet } from "mapv";
import stores from "./data/stores";
import chartsData from "./data/chartsData";
import echarts from "echarts";
import PointTable from "./components/PointTable.vue";
import { BmlHeatmap } from "vue-baidu-map";
export default {
  name: "app",
  components: {
    BaiduMap,
    PointTable,
    BmlHeatmap
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 16,
      stores: [],
      points: [],
      currentData: [],
      pointsColor: "#e15d68c0",
      colors: {
        cHotPot: "#e15d68",
        cSc: "#f29961",
        cSnacks: "#00cccd",
        cDessert: "#407fff",
        cFastFoods: "#a682e6",
        cOther: "#e15d68"
      },
      point: { lng: 0, lat: 0 },
      heatMapdata: []
    };
  },
  created() {
    for (let item of stores) {
      this.stores.push({ ...item, lng: item.x, lat: item.y, count: 50 });
    }
    this.currentData = this.stores.slice(0);
    this.points = this.currentData.slice(0);
    this.addPoints();
  },
  mounted() {
    this.renderPipe();
    this.renderHit();
    /*
    let height = document.body.clientHeight;
    document.getElementsByClassName("chart-box")[0].height =
      (height * 40) / 100 + "px";
    document.getElementsByClassName("box-map")[0].height =
      (height * 15) / 100 + "px";*/
  },
  methods: {
    renderHit() {
      var storeTop10 = chartsData.storeTop10;
      var ydata = {};
      ydata.data = [];
      ydata.ids = [];
      var tstar = [];
      var ttast = [];
      var tenv = [];
      var tservice = [];
      for (let i in storeTop10) {
        var item = storeTop10[storeTop10.length - 1 - i];
        ydata.data.push({ value: item.name, textStyle: { color: "#76c0ff" } });
        ydata.ids.push(item.item_id);
        tstar.push(item.star);
        ttast.push(item.tast);
        tenv.push(item.environment);
        tservice.push(item.service);
      }
      var option = {
        title: {
          text: "排名",
          textStyle: {
            color: "#e5bd6f"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: {
            color: "#76c0ff"
          },
          data: ["口味评分", "环境评分", "服务评分"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: ydata.data,
          ids: ydata.ids
        },
        series: [
          {
            name: "口味评分",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: ttast
          },
          {
            name: "环境评分",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: tenv
          },
          {
            name: "服务评分",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: tservice
          }
        ],
        color: ["#da6d75", "#14c6ca", "#6996f3"]
      };
      var ecmTime = echarts.init(document.getElementById("hit"));
      ecmTime.setOption(option);
    },
    renderPipe() {
      let storeTypeCount = chartsData.storeTypeCount;
      let selected = {};
      let legendData = [];
      let seriesData = [];
      for (let i in storeTypeCount) {
        let item = storeTypeCount[i];
        legendData.push({
          name: item.cat_name,
          textStyle: {
            color: "#76c0ff"
          }
        });
        seriesData.push({
          name: item.cat_name,
          value: item.count
        });
        if (i < 6) {
          selected[item.cat_name] = true;
        } else {
          selected[item.cat_name] = false;
        }
      }

      var option = {
        title: {
          text: "绵阳各类饭店占比",
          x: "center",
          textStyle: {
            color: "#e5bd6f"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: legendData,
          selected: selected
        },
        series: [
          {
            name: "店名",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              // color:"#76c0ff"
            }
          }
        ],
        color: [
          this.colors.cHotPot,
          this.colors.cSc,
          this.colors.cSnacks,
          this.colors.cDessert,
          this.colors.cFastFoods
        ]
      };
      var pie = echarts.init(document.getElementById("pipe"));
      pie.setOption(option);
      pie.on("mouseover", param => {
        let name = param.data.name;
        this.pointsColor =
          name === "火锅"
            ? this.colors.cHotPot
            : name === "川菜"
            ? this.colors.cSc
            : name === "小吃面食"
            ? this.colors.cSnacks
            : name === "面包甜点"
            ? this.colors.cDessert
            : name === "快餐简餐"
            ? this.colors.cFastFoods
            : this.colors.cOther;
        this.currentData = this.stores.filter(item => item.cat_name === name);
        this.points = this.currentData.slice(0);
        this.heatMapdata.splice(0);
      });
    },
    handler({ BMap, map }) {
      this.center.lng = 104.75517;
      this.center.lat = 31.46758;
      map.enableScrollWheelZoom();
      map.setMapStyle({ style: "midnight" });
      this.BMap = BMap;
      this.map = map;
      document
        .getElementById("bmap")
        .addEventListener("mousewheel", (e, dl) => {
          let curZoom = map.getZoom();
          if (curZoom > 15) {
            this.points = this.currentData.slice(0);
            this.heatMapdata.splice(0);
          } else {
            this.heatMapdata = this.currentData.slice(0);
            this.points.splice(0);
          }
        });
    },
    clickHandler() {},
    addPoints() {
      let points = [];
      for (let item of this.stores) {
        points.push({ ...item, lng: item.x, lat: item.y });
      }
      this.points = points;
    },
    onTableItemHover(item) {
      this.point.lng = item.lng;
      this.point.lat = item.lat;
      this.center.lng = item.lng;
      this.center.lat = item.lat;
      this.heatMapdata.splice(0);
      this.points = this.currentData.slice(0);
    }
  }
};
</script>

<style>
@import "app.css";
</style>
