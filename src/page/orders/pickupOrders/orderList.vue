<style scoped lang="less">
  /deep/ .el-table {
  &:before {
    height: 0;
  }
  th {
    &.is-leaf {
      border: none;
    }
  }
}
.searchButton:hover{
  background-color:#f5f7fa;
}


</style>
<template>
  <div>
    <div class="nav-tab-setting" style="position:relative;">
      <el-tabs v-model="activeName" @tab-click="clicktabs">
        <el-tab-pane label="公有提货单" name="first">
          <div class="tab-content">
            <el-form class="search-filters-form" label-width="80px" status-icon ref="seachHeadCarListFrom" :rules="rules">
              <el-row :gutter="0">
                <el-col :span="12">
                  <el-input placeholder="请输入" v-model="fifterParam.keyword" class="search-filters-screen" @keyup.native.13="searchList">
                    <el-select v-model="fifterParam.field" slot="prepend" placeholder="请选择">
                      <el-option v-for="(item,key) in selectData.fieldSelect" :key="key" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
                  </el-input>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item label="计划装货时间:" prop="buyInsuranceDate" label-width="105px">
                    <el-date-picker :editable="editable" :picker-options="pickerOptions" v-model="timeParam" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" style="position:absolute;right:0;bottom:-53px;z-index:500" @click="changeExtendsStatus" v-if="expandStatus">收起<i class="el-icon-arrow-up el-icon--right"></i></el-button>
      <el-button type="primary" style="position:absolute;right:0;bottom:-53px;z-index:500" @click="changeExtendsStatus" v-if="!expandStatus">展开<i class="el-icon-arrow-down el-icon--right"></i></el-button>
    </div>
    <div class="nav-tab-setting mt-25" v-loading="pageLoading">
      <el-tabs v-model="thisFifterName" @tab-click="clickFifter">
        <el-tab-pane :label="statusName.all_count" name="all">
          <div class="tab-content padding-clear-top" v-if="thisFifterName=='all'">
            <keep-alive>
              <orderFifterList :ListData="listFifterData" @refreshList="searchList" :expandStatus="expandStatus"></orderFifterList>
            </keep-alive>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="statusName.appoint_count" name="appoint">
          <div class="tab-content padding-clear-top" v-if="thisFifterName=='appoint'">
            <keep-alive>
              <orderFifterList :ListData="listFifterData" @refreshList="searchList" :expandStatus="expandStatus"></orderFifterList>
            </keep-alive>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="statusName.determine_count" name="determine">
          <div class="tab-content padding-clear-top" v-if="thisFifterName=='determine'">
            <keep-alive>
              <orderFifterList :ListData="listFifterData" @refreshList="searchList" :expandStatus="expandStatus"></orderFifterList>
            </keep-alive>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="statusName.confirmed_count" name="confirmed">
          <div class="tab-content padding-clear-top" v-if="thisFifterName=='confirmed'">
            <keep-alive>
              <orderFifterList :ListData="listFifterData" @refreshList="searchList" :expandStatus="expandStatus"></orderFifterList>
            </keep-alive>
          </div>
        </el-tab-pane>
        <el-tab-pane name="history">
          <span slot="label">
        <el-popover 
          placement="right-start"
          width="100"
          trigger="hover"
          v-model="seachExtend" style="padding:8px 0" popper-class="styleSetP">
          <el-row >
            <el-col class="searchButton" @click.native="changeF('history')"><el-button type="text" style="color:black" >{{statusName.history_count}}</el-button></el-col>
            <el-col class="searchButton" @click.native="changeF('loaded')"><el-button type="text" style="color:black" >{{statusName.loaded_count}}</el-button></el-col>
            <el-col class="searchButton" @click.native="changeF('canceled')" style="border-bottom:none"><el-button type="text" style="color:black" >{{statusName.canceled_count}}</el-button></el-col>
          </el-row>
          <el-button slot="reference" type="text" style="color:black">{{statusName.history_count}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
        </el-popover>
        </span>
          <div class="tab-content padding-clear-top" v-if="thisFifterName=='history'">
            <keep-alive>
              <orderFifterList :ListData="listFifterData" @refreshList="searchList" :expandStatus="expandStatus"></orderFifterList>
            </keep-alive>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-list text-center">
      <el-pagination background layout="prev, pager, next,jumper" :page-count="pageData.totalPage" :page-size="pageData.pageSize" :current-page.sync="pageData.currentPage" @current-change="pageChange" v-if="!pageLoading && pageData.totalPage>1">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ordersList',
  components: {
    orderFifterList: () =>
      import("../../../components/order/orderFifterList.vue")
  },
  data() {
    return {
      editable: false,
      seachExtend: false,
      pickerOptions: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '今天',
            onClick(picker) {
              const end = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " 23:59:59";
              const start = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " 00:00:00";
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '今明两天',
            onClick(picker) {
              const start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " 00:00:00");
              const end = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " 00:00:00");
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 2 - 1000);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      searchStatus: false,
      pageLoading: false,
      historyStatus: '',
      fifterParam: {
        keyword: "",
        field: "trader_name",
      },
      statusName: {
        all_count: '全部',
        appoint_count: '待指派',
        determine_count: '待确认',
        confirmed_count: '已确认',
        loaded_count: '已完成',
        canceled_count: '已取消',
        history_count: '历史'
      },
      allStatusName: {
        all_count: '全部',
        appoint_count: '待指派',
        determine_count: '待确认',
        confirmed_count: '已确认',
        loaded_count: '已完成',
        canceled_count: '已取消',
        history_count: '历史'
      },

      listFifterData: [],
      rules: {},
      activeName: 'first',
      expandStatus: false,
      timeParam: [

      ],
      pageData: {
        currentPage: 1,
        totalPage: 1,
        pageSize: 10,
      },
      thisFifterName: "all",
      selectData: {
        vehicle_type_Select: this.$store.state.common.selectData.truck_attributes,
        brand_Select: this.$store.state.common.selectData.semitrailer_vehicle_type,
        fieldSelect: [
          { id: 'trader_name', value: '托运商' },
          { id: 'order_number', value: '订单号' },
          { id: 'fluid_name', value: '供方液厂名称' },
          { id: 'waybill_number', value: '运单号' },
          { id: 'truck_no', value: '车号' }

        ]
      },
    };
  },
  computed: {
    fifterName: function() {
      if (this.$route.query.goTo) {
        return this.$route.query.goTo
      } else {
        return 'all'
      }
    },
  },
  methods: {
    clicktabs: function(targetName) {

    },
    goAddNewOder: function() {
      this.$router.push({ path: "/orders/pickupOrders/addNewPickUpOrder" });
    },
    changeExtendsStatus: function() {
      this.expandStatus = !this.expandStatus;
    },
    changeF: function(type) {
      this.pageData.currentPage = 1;
      this.seachExtend = false;
      this.thisFifterName = 'history';
      if (type != 'history') {
        this.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=" + this.thisFifterName + "&st=" + type });
      } else {
        this.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=" + this.thisFifterName });
      }
    },
    searchList: function(type) {

      var sendData = {};
      var vm = this;
      if (this.fifterParam.field) {
        sendData[this.fifterParam.field] = this.fifterParam.keyword;
      }
      if (this.timeParam instanceof Array && this.timeParam.length > 0) {
        sendData.plan_time_start = this.timeParam[0];
        sendData.plan_time_end = this.timeParam[1];
      }
      if (this.thisFifterName != "all") {
        sendData.status = this.thisFifterName;
      }
      if (this.thisFifterName == 'history') {
        if (this.historyStatus == 'history' || this.historyStatus == '') {
          sendData.history = true;
          delete sendData.status;
        } else {
          sendData.status = this.historyStatus;
        }
      }
      sendData.type = 'online';
      sendData.page_size = this.pageData.pageSize;
      if (this.searchStatus) {
        sendData = this.saveSendData;
        sendData.page = this.pageData.currentPage;
      } else {
        this.pageData.currentPage = 1;
        sendData.page = this.pageData.currentPage;
      }
      this.pageLoading = true;

      this.$$http("searchPickOrderList", sendData).then((results) => {
        this.pageLoading = false;
        if (results.data.code == 0) {
          vm.saveSendData = sendData;
          vm.searchStatus = false;
          var dataBody = results.data.data.data;
          vm.pageData.totalPage = Math.ceil(results.data.data.count / vm.pageData.pageSize);
          vm.listFifterData = dataBody;
        }
      }).catch(() => {
        this.pageLoading = false;
      });
      // this.getCountList();
    },
    clickFifter: function(targetName) {
      //this.historyStatus = targetName.name;
      this.pageData.currentPage = 1;
      //重新查询一次数据
      //this.searchList();
      this.historyStatus = "";
      this.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=" + this.thisFifterName });
    },
    pageChange: function() {
      setTimeout(() => {
        this.searchStatus = true;
        this.searchList();
      });
    },
    // getCountList: function() {
    //   var renderStatus = this.pbFunc.deepcopy(this.allStatusName);
    //   this.$$http("getCount", {}).then(results => {
    //     if (results.data.code == 0) {
    //       var dataBody = results.data.data;
    //       for (var i in dataBody) {
    //         if (dataBody[i] > 99) {
    //           dataBody[i] = '99+';
    //         }
    //         renderStatus[i] += "(" + dataBody[i] + ")";
    //       }
    //       this.statusName = renderStatus;
    //     }
    //   }).catch(() => {

    //   });
    // }
  },
  created() {
    if (this.thisFifterName != this.fifterName) {
      this.thisFifterName = this.fifterName;
    }
    //this.listFifterData = this.listData;
    this.searchList();
    // var defaultStart=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+" 00:00:00"
    // var defaultEnd=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+" 23:59:59";
    // this.timeParam=[defaultStart,defaultEnd];

  },
  watch: {
    '$route'(to, from) {
      //刷新参数放到这里里面去触发就可以刷新相同界面了
      this.thisFifterName = this.$route.query.goTo || "all";
      this.historyStatus = this.$route.query.st || "";
      this.searchList();
    }
  }
};

</script>
