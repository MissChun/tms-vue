<style scoped lang="less">
.el-table {
  /deep/ .el-table__fixed-header-wrapper {
    top: 1px;
    tr th .el-checkbox__inner {
      display: none;
    }
  }
  /deep/ tr td .cell {
    text-align: center;
  }
  /deep/ tr th .cell {
    text-align: center;
  }
}

.detail-tab {
  position: relative;
  .operation-btn {
    position: absolute;
    width: 100%;
    top: -25px;
    z-index: 2;
  }
  .el-tabs__header {
    .el-tabs__nav .el-tabs__item {
      /deep/ &.is-active {
        background: #f2f5fe;
        &:after {
          border: 0!important;
          top: 32px;
        }
      }
    }
  }
  /deep/ .el-table__fixed-right {
    border-top: 1px solid #e4e7ed;
  }
}

.go-return {
  width: 32px;
  height: 32px;
  margin-top: 14px;
}

.el-header p {
  height: 60px;

  font-size: 26px;
  line-height: 60px;

  text-align: center;
}
.unloadList{
  margin-top:20px;
}
.pre_unInfo{
  line-height:40px;
  font-size:14px;
  position: absolute;
  left:105px;
  margin-top:12px;
  text-align:left;
}
</style>
<template>
  <div>
    <div class="nav-tab">
      <div class="tab-screen">
        <el-header>
          <el-row>
            <el-col :span="3">
              <router-link :to="{path: '/orders/pickupOrders/ordersList'}">
                <div class="go-return icon-back"></div>
              </router-link>
            </el-col>
            <el-col :span="18">
              <p>车辆指派</p>
            </el-col>
          </el-row>
        </el-header>
        <el-form class="search-filters-form" label-width="80px" :model="searchFilters" status-icon label-position="left">
          <el-row :gutter="0">
            <el-col :span="16" :offset="4">
              <el-input placeholder="请输入" v-model="searchFilters.keyword" @keyup.native.13="startSearch" class="search-filters-screen">
                <el-select v-model="searchFilters.field" slot="prepend" placeholder="请选择">
                  <el-option v-for="(item,key) in selectData.fieldSelect" :key="key" :label="item.value" :value="item.id"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="startSearch"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="nav-tab-setting detail-tab mt-25">
      <div class="operation-btn text-right">
        <el-row :gutter="0" style="position:relative;">
          <!--  <el-col :span="4">
          <el-form-item label="状态:">
            <el-select v-model="searchFilters.orderStateList" @change="startSearch" placeholder="请选择">
              <el-option v-for="(item,key) in selectData.orderStateListSelect" :key="key" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
          <el-col :span="6"  class="pre_unInfo" v-if="delivery_list.pre_business_order_list&&delivery_list.pre_business_order_list.length>0">
            <el-tooltip class="item" effect="light" placement="left-end">
            <div slot="content" style="width:250px;">
              <el-row v-for="(Uitem,Uindex) in delivery_list.pre_business_order_list" v-bind:class="{unloadList:Uindex!=0}">
                <el-col >业务单号:{{Uitem.order_number}}</el-col>
                <el-col style="margin-top:10px;">站点:{{Uitem.station}}</el-col>
                <el-col style="margin-top:10px;">需求液厂:{{Uitem.actual_fluid_name}}</el-col>
                <el-col style="margin-top:10px;">计划吨位:<span v-if="Uitem.plan_tonnage">{{Uitem.plan_tonnage}}吨</span></el-col>
                <el-col style="margin-top:10px;" class="whiteSpan">
                  计划到站时间:
                  <el-tooltip class="item" effect="light" :open-delay="1000" :content="Uitem.plan_arrive_time" placement="top-start" v-if="Uitem.plan_arrive_time">
                    <span >{{Uitem.plan_arrive_time}}</span>
                  </el-tooltip>
                  <span v-else>无</span>
                </el-col>
              </el-row>
            </div>
            <div class="whiteSpan">预匹配卸货站点:<span v-for="(Uitem,Uindex) in delivery_list.pre_business_order_list"><span v-if="delivery_list.pre_business_order_list&&delivery_list.pre_business_order_list.length>1&&Uindex!=delivery_list.pre_business_order_list.length-1">{{Uitem.station}}/</span><span v-else>{{Uitem.station}}</span></span></div>
          </el-tooltip>
          </el-col>
          <el-col :span="3" :offset="19" style="line-height:40px;font-size:14px;" v-if="delivery_list.status && delivery_list.status.key!='canceled'">
            需求车数{{now_capacities.length}}/{{delivery_list.require_car_number}}
          </el-col>
          <el-col :span="2" v-if="delivery_list.status && delivery_list.status.key!='canceled'">
            <el-button v-if="operationStatus=='add'" type="primary" plain @click="operation('addCar')">添加车辆</el-button>
            <el-button v-if="operationStatus=='edit'" type="primary" @click="operation('changeCar')">提交修改</el-button>
          </el-col>
          <el-col :span="4" :offset="20" v-if="delivery_list.status && delivery_list.status.key=='canceled'">当前订单已经取消,不可操作</el-col>
        </el-row>
      </div>
      <div class="nav-tab-setting">
      <el-tabs v-model="activeName" @tab-click="clicktabs" :filter-method="filterHandler">
        <el-tab-pane label="列表" name="first">
          <div class="table-list border-top-clear">
            <el-table :data="renderPage_list" ref="multipleTable" stripe style="width: 100%" size="mini" v-loading="pageLoading" @select="checkRows">
              <el-table-column prop="tractor.plate_number" align="center" label="车号" :width="140" fixed="left">
              </el-table-column>
              <el-table-column v-for="(item,key) in thTableList" :key="key" :prop="item.param" align="center" :label="item.title" :width="item.width?item.width:150">
              </el-table-column>
              <el-table-column label="勾选" type="selection" width="55" fixed="right" :selectable="checkSelectable">
              </el-table-column>
              <el-table-column label="状态" width="90" fixed="right">
                <template slot-scope="scope">
                  <el-tag :type="allStatus.indexOf(scope.row.waybill.status)>-1 ? 'success' :(scope.row.waybill.status==='canceled'? 'warning':(noCanceled.indexOf(scope.row.waybill.status)>-1?'danger': 'primary'))" disable-transitions>{{allStatus.indexOf(scope.row.waybill.status)>-1 ? '已审核' :(scope.row.waybill.status==='canceled'? '已取消过': (noCanceled.indexOf(scope.row.waybill.status)>-1?'不可取消':'未选择过'))}}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page-list text-center ">
            <el-pagination background layout="prev, pager, next,jumper " :page-count="pageData.totalPage " :page-size="pageData.pageSize " :current-page.sync="pageData.currentPage " @current-change="pageChange " v-if="!pageLoading && pageData.totalPage>1">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    </div>
    <el-dialog title="注意:" :visible.sync="juageAddDialog" width="50%" :center="'center'" :show-close="closeModel" :close-on-click-modal="closeModel" :close-on-press-escape="closeModel">
      <div style="margin:15px 5%">车号{{judgeAddRow.tractor&&judgeAddRow.tractor.plate_number}} 有司机未确认订单:</div>
      <el-table :data="judgeAddData" style="width:90%;margin-left:5%" border size="small">
        <el-table-column property="delivery_order_number" label="订单号" width="150"></el-table-column>
        <el-table-column property="willbill_number" label="运单号" width="200"></el-table-column>
        <el-table-column property="status.verbose" label="状态"></el-table-column>
        <el-table-column property="type.verbose" label="类型"></el-table-column>
        <el-table-column property="delivery_order_create_time" label="日期" min-width="150px"></el-table-column>
      </el-table>
      <div style="margin:25px 5%">继续操作可能导致司机上传磅单和后续流程错误，是否继续添加进本订单？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="juageAddDialogClose">取 消</el-button>
        <el-button type="primary" @click="sureChosse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'orderDetailTab',
  data() {
    return {
      activeName: 'first',
      pageLoading: false,
      juageAddDialog: false,
      closeModel: false,
      pageData: {
        currentPage: 1,
        totalPage: 1,
        pageSize: 10,
      },
      searchFilters: {
        keyword: '',
        field: 'tractor.plate_number',
        orderStateList: '',
      },
      allStatus: ['driver_pending_confirmation', 'to_fluid', 'reach_fluid', 'waiting_seal', 'loading_waiting_audit'],
      noCanceled: ['loading_audit_failed', 'waiting_match', 'already_match', 'to_site', 'reach_site', 'unloading_waiting_audit', 'unloading_audit_failed', 'waiting_settlement', 'in_settlement', 'finished', 'confirm_match', 'abnormal'],
      selectData: {
        fieldSelect: [{
          value: '车号',
          id: 'tractor.plate_number',
        }, {
          value: '姓名',
          id: 'master_driver.name',
        }, {
          value: '电话',
          id: 'master_driver.mobile_phone',
        }],
        orderStateListSelect: [{
          value: '车号',
          id: '1',
        }]
      },
      thTableList: [{
        title: '变更',
        param: 'waybill.waybill_change_status_display',
        width: ''
      }, {
        title: '运单状态',
        param: 'waybill.status_display',
        width: ''
      }, {
        title: '运单号',
        param: 'waybill.waybill',
        width: ''
      }, {
        title: '挂车',
        param: 'semitrailer.plate_number',
        width: '250'
      },
      {
        title: '车辆所属',
        param: 'tractor.carrier.name',
        width: ''
      },
      {
        title: '司机',
        param: 'master_driver.name',
        width: ''
      }, {
        title: '司机电话',
        param: 'master_driver.mobile_phone',
        width: ''
      }, {
        title: '押运',
        param: 'escort_staff.name',
        width: ''
      }, {
        title: '押运电话',
        param: 'escort_staff.mobile_phone',
        width: ''
      }, {
        title: '副驾',
        param: 'vice_driver.name',
        width: ''
      }, {
        title: '副驾电话',
        param: 'vice_driver.mobile_phone',
        width: ''
      }],
      tableData: [],
      tractor_semitrailers_List: [], //运力列表
      renderAll_list: [], //查询筛选后的所有需要渲染列表
      trueAll_list: [], //查询筛选后的所有数据
      upTo_list: [], //最近三天已经被使用的运力
      delivery_list: [], //提货单拥有的运单，审核后
      haveTranspower_list: [], //提货单所拥有的运力,未审核
      renderPage_list: [], //当前页渲染的数据
      alreadyList: {}, //上一次修改的数据
      lastSearch_list: [], //最后一次查询出来的数据
      add_capacities: [], //增加的运力表
      del_capacities: [], //取消的运力表
      start_capacities: [], //初始的运力表
      now_capacities: [], //已经选择的运力表
      default_del_capacities: [], //默认需要取消的运力

      judgeAddData: {}, //选择车辆时,当前车如果背有未确认的运单时候需要展示的数据源
      judgeAddRow: {} //缓存的即将要被添加的数据
    }
  },
  computed: {
    id: function() {
      return this.$route.params.id;
    },
    operationStatus: function() {
      return this.$route.params.type;
    }
  },
  methods: {
    sureChosse: function() {
      this.$refs.multipleTable.toggleRowSelection(this.judgeAddRow, true);
      this.trueAll_list.forEach((Titem) => {
        if (Titem.id == this.judgeAddRow.id) {
          Titem.bindCheckBox = true;
        }
      });
      this.juageAddDialog = false;
    },
    juageAddDialogClose: function() {
      this.juageAddDialog = false;
      this.$refs.multipleTable.toggleRowSelection(this.judgeAddRow, false);
      var new_now_capacities1 = [];
      this.now_capacities.forEach((item, index) => {
        if (item.id != this.judgeAddRow.id) {
          new_now_capacities1.push(item);
        }
      });
      this.now_capacities = new_now_capacities1;
      this.trueAll_list.forEach((Titem) => {
        if (Titem.id == this.judgeAddRow.id) {
          Titem.bindCheckBox = false;
        }
      });
    },
    checkSelectable: function(row) {
      return !row.isDisable
    },
    filterTag: function(value, row) {
      if (row.waybill.status) {
        return row.waybill.status === value;
      } else {
        return !row.waybill.status
      }
    },
    filterHandler: function(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    clicktabs: function(targetName) {
      if (targetName.name == 'second') {
        this.$router.push({ path: `/orders/pickupOrders/orderDetail/arrangeCarTab/arrangeCarMap/${this.id}` });
      }
    },
    checkRows: function(selection, row) {
      var vm = this;
      var addArr = [];
      selection.forEach((sItem) => {
        var addflag = true;
        vm.now_capacities.forEach((item) => {
          if (item.id == sItem.id) {
            addflag = false;
          }
        });
        if (addflag) {
          addArr.push(sItem);
        }
      });
      this.now_capacities = this.now_capacities.concat(addArr);
      if (row.id) {
        var sendJudge = false;
        selection.forEach(item => {
          if (item.id == row.id) {
            sendJudge = true;
          }
        });
        if (sendJudge) {
          //如果当前为勾选
          let nextStatus=true;//判断是否是预匹配
          if(this.delivery_list.pre_business_order_list&&this.delivery_list.pre_business_order_list.length>0){
            if(this.now_capacities.length>1){
              nextStatus=false;
            }
          }
          if(nextStatus){
            //判断是否在别的订单。
            let postData3 = {
              transport_id: row.id,
              delivery_order_id:this.id
            };
            this.$$http('searchNoUse', postData3).then((results) => {

              if (results.data && results.data.code == 0) {
                vm.pageLoading = false;
                if(results.data.data.interrupt_waybill_number.length>0){
                  this.$alert(row.tractor.plate_number+'正变更在运单'+results.data.data.interrupt_waybill_number[0]+'下，请不要重复操作，需托运方相关人员确认！', '请注意', {
                    confirmButtonText: '确定',
                    callback: action => {
                        vm.$refs.multipleTable.toggleRowSelection(row, false);
                        var new_now_capacities1 = [];
                        vm.now_capacities.forEach((item, index) => {
                          if (item.id != row.id) {
                            new_now_capacities1.push(item);
                          }
                        });
                        vm.now_capacities = new_now_capacities1;
                        vm.trueAll_list.forEach((Titem) => {
                          if (Titem.id == row.id) {
                            Titem.bindCheckBox = false;
                          }
                        });
                    }
                  });
                } else if (results.data.data.trips_driver_unconfirm_list.length == 0 && results.data.data.delivery_list.length > 0) {
                  var orderListText = "";
                  results.data.data.forEach((item) => {
                    orderListText += item + ",";
                  });
                  // const h = this.$createElement;
                  // vm.$confirm({
                  //   title: '请注意',
                  //   message: h('p', null, [
                  //     h('span', null, '车号 ' + row.tractor.plate_number + " 已存在于订单"),
                  //     h('i', { style: 'color: teal' }, orderListText + "是否继续添加进入订单")
                  //   ]),
                  //   showCancelButton: true,
                  //   confirmButtonText: '继续添加',
                  //   cancelButtonText: '返回',
                  //   beforeClose: (action, instance, done) => {
                  //     if (action === 'confirm') {
                  //       done();

                  //     } else {

                  //       done();
                  //     }
                  //   }
                  // })
                  vm.$confirm('车号 ' + row.tractor.plate_number + " 已存在于订单" + orderListText + "是否继续添加进入订单", '提示', {
                    confirmButtonText: '继续添加',
                    cancelButtonText: '返回',
                    type: 'warning',
                    center: true,
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false
                  }).then(() => {
                    row.bindCheckBox = !row.bindCheckBox;
                    vm.trueAll_list.forEach((Titem) => {
                      if (Titem.id == row.id) {
                        Titem.bindCheckBox = true;
                      }

                    });
                  }).catch(() => {
                    vm.$refs.multipleTable.toggleRowSelection(row, false);
                    var new_now_capacities1 = [];
                    vm.now_capacities.forEach((item, index) => {
                      if (item.id != row.id) {
                        new_now_capacities1.push(item);
                      }
                    });
                    vm.now_capacities = new_now_capacities1;
                    vm.trueAll_list.forEach((Titem) => {
                      if (Titem.id == row.id) {
                        Titem.bindCheckBox = false;
                      }
                    });
                  });
                } else if (results.data.data.trips_driver_unconfirm_list.length != 0) {
                  vm.juageAddDialog = true;
                  vm.judgeAddData = results.data.data.trips_driver_unconfirm_list;
                  vm.judgeAddRow = row;
                } else if (results.data.data.trips_driver_unconfirm_list.length == 0 && results.data.data.delivery_list.length == 0 && results.data.data.interrupt_waybill_number.length==0)  {
                  row.bindCheckBox = !row.bindCheckBox;
                  vm.trueAll_list.forEach((Titem) => {
                    if (Titem.id == row.id) {
                      Titem.bindCheckBox = true;
                    }
                  });
                }
              }
            }).catch((err) => {
              vm.pageLoading = false;
            });
          }else{
            vm.$confirm('预匹配卸货地订单只能匹配一辆车', '请注意', {
                  confirmButtonText: '确认',
                  type: 'warning',
                  showCancelButton: false,
                  center: true,
                  closeOnClickModal: false,
                  showClose: false,
                  closeOnPressEscape: false
               }).then(() => {
                vm.$refs.multipleTable.toggleRowSelection(row, false);
                var new_now_capacities1 = [];
                vm.now_capacities.forEach((item, index) => {
                  if (item.id != row.id) {
                    new_now_capacities1.push(item);
                  }
                });
                vm.now_capacities = new_now_capacities1;
                  vm.trueAll_list.forEach((Titem) => {
                    if (Titem.id == row.id) {
                      Titem.bindCheckBox = false;
                    }
                  });
              })
          }

        } else {
          //如果是取消勾选,判断当前车辆是否能取消勾选
          if (row.waybill.waybill) {
            vm.pageLoading = true;
            vm.$$http("judgeCanCancle", { waybill_id: row.waybill.waybill_id }).then((results) => {
              vm.pageLoading = false;
              if (results.data.code == 0) {
                if (results.data.data.status) {
                  row.bindCheckBox = !row.bindCheckBox;
                  vm.trueAll_list.forEach((Titem) => {
                    if (Titem.id == row.id) {
                      Titem.bindCheckBox = false;
                    }
                  });
                  var new_now_capacities1 = [];
                  vm.now_capacities.forEach((item, index) => {
                    if (item.id != row.id) {
                      new_now_capacities1.push(item);
                    }
                  });
                  vm.now_capacities = new_now_capacities1;
                } else {
                  vm.$confirm('当前运单不能被取消', '请注意', {
                    confirmButtonText: '确认',
                    type: 'warning',
                    showCancelButton: false,
                    center: true,
                    closeOnClickModal: false,
                    showClose: false,
                    closeOnPressEscape: false
                  }).then(() => {
                    vm.$refs.multipleTable.toggleRowSelection(row, true);
                  })
                }
              }
            }).catch(() => {
              vm.pageLoading = false;
              vm.$refs.multipleTable.toggleRowSelection(row, true);
            });
          } else {
            row.bindCheckBox = !row.bindCheckBox;
            vm.trueAll_list.forEach((Titem) => {
              if (Titem.id == row.id) {
                Titem.bindCheckBox = false;
              }
            });
            var new_now_capacities = [];
            vm.now_capacities.forEach((item, index) => {
              if (item.id != row.id) {
                new_now_capacities.push(item);
              }
            });
            vm.now_capacities = new_now_capacities;
          }
        }
      }
    },
    judgeIsOrderStatus: function(callFunc) {
      this.$$http('getPickOrderDetail', { id: this.id }).then((results) => {
        if (results.data && results.data.code == 0) {
          if (results.data.data.status.key == "determine" || results.data.data.status.key == 'confirmed') {
            callFunc(1);
          } else if (results.data.data.status.key == "appoint") {
            callFunc(0);
          } else {
            callFunc(2);
          }
        }
      }).catch((err) => {
        console.log('cc', err);
      });
    },
    startSearch: function() {
      this.pageData.currentPage = 1;
      this.searchThisByData();
    },
    operation: function(type) {
      var vm = this;
      if (type == 'addCar') {
        if (this.now_capacities.length > 0) {
          var sendData = {
            delivery_order_id: "",
            add_capacities: []
          };
          this.now_capacities.forEach(item => {
            sendData.add_capacities.push(item.id);
          });
          sendData.delivery_order_id = this.delivery_list.id;
          this.pageLoading = true;
          this.judgeIsDataChange((flage) => {
            if (flage == '1') {
              this.judgeIsOrderStatus((oerderStatus) => {
                if (oerderStatus == '0') { //状态为变更
                  this.$$http("addCarPower", sendData).then((results) => {
                    this.pageLoading = false;
                    if (results.data.code == 0) {
                      if (this.operationStatus == 'add') {
                        vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=appoint" });
                      } else {
                        vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=determine" });
                      }
                    }
                  });
                } else if (oerderStatus == '1') { //状态变更为修改
                  vm.$confirm('当前订单已经提交计划', '请注意', {
                    confirmButtonText: '继续修改计划',
                    cancelButtonText: '返回列表',
                    type: 'warning',
                    center: true,
                    closeOnClickModal: false,
                    showClose: false,
                    closeOnPressEscape: false
                  }).then(() => {
                    vm.$router.push({ path: `/orders/pickupOrders/orderDetail/arrangeCarTab/arrangeCarList/${this.id}/edit` });
                  }).catch(() => {
                    vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=determine" });
                  })
                } else if (oerderStatus == '2') { //状态变更为不能修改
                  vm.$confirm('当前订单状态已经不能新增', '请核实', {
                    confirmButtonText: '确认',
                    showCancelButton: false,
                    type: 'warning',
                    center: true,
                    closeOnClickModal: false,
                    showClose: false,
                    closeOnPressEscape: false
                  }).then(() => {
                    vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=all" });
                  })
                }
              });

            } else {
              vm.$confirm('订单数据已更新，请重新操作', '请注意', {
                confirmButtonText: '确认',
                showCancelButton: false,
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                showClose: false,
                closeOnPressEscape: false
              }).then(() => {
                vm.$router.go(0);
              })
            }
          });

        } else {
          vm.$confirm('提交车辆不能为0', '请注意', {
            confirmButtonText: '确认',
            showCancelButton: false,
            type: 'warning',
            center: true,
            closeOnClickModal: false,
            showClose: false
          }).then(() => {

          })
        }
      } else if (type == 'changeCar') {
        var sendData = {
          delivery_order_id: "",
          add_capacities: [],
          del_capacities: [],
          id: this.delivery_list.id,
          yid: this.delivery_list.id,
          delivery_order_id: this.delivery_list.id
        };
        this.now_capacities.forEach(item => {
          var addFalg = true;
          vm.start_capacities.forEach(startItem => {
            if (item.id == startItem.capacity) {
              addFalg = false;
            }
          });
          if (addFalg && !(vm.allStatus.indexOf(item.waybill.status) > -1)) {
            sendData.add_capacities.push(item.id);
          }
        });
        this.start_capacities.forEach(item => {
          var cancleFalg = true;
          vm.now_capacities.forEach(nowItem => {
            if (item.capacity == nowItem.id) {
              cancleFalg = false;
            }
          });
          if (cancleFalg && item.waybill_id && vm.allStatus.indexOf(item.status) > -1) {
            sendData.del_capacities.push(item.capacity);
          }
        });

        var ischange = false;
        this.start_capacities.forEach(item => {
          var isfalge = false;
          vm.now_capacities.forEach(nowItem => {
            if ((item.capacity || item.id) == nowItem.id) {
              isfalge = true;
            }
          });
          if (!isfalge) {
            ischange = true;
          }
        });


        sendData.del_capacities = sendData.del_capacities.concat(this.default_del_capacities);
        // this.del_capacities=sendData.del_capacities.concat(this.default_del_capacities);
        // this.add_capacities=sendData.add_capacities;
        if (!ischange && this.start_capacities.length == this.now_capacities.length) {
          vm.$confirm('您没有任何修改', '请注意', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning',
            center: true,
            closeOnClickModal: false,
            showClose: false,
            closeOnPressEscape: false
          }).then(() => {}).catch(() => {})
        } else {
          vm.upchange(sendData);
        }
      }
    },
    upchange: function(sendData) {
      var vm = this;
      vm.judgeIsDataChange(function(flage) {
        if (flage == '1') { //如果数据和上一次对比没有改变
          if (vm.now_capacities.length > 0) {
            if (sendData.del_capacities.length > 0 || sendData.add_capacities.length > 0) {
              vm.pageLoading = true;
              vm.$$http("editCarPower", sendData).then((results) => {
                vm.pageLoading = false;
                if (results.data.code == 0) {
                  vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=determine" });
                }
              }).catch(() => {
                vm.pageLoading = false;
              });
            }
          } else {
            vm.$confirm('修改后车辆为0,状态会置为待指派', '请注意', {
              confirmButtonText: '确认提交',
              cancelButtonText: '返回',
              type: 'warning',
              center: true,
              closeOnClickModal: false,
              showClose: false
            }).then(() => {
              vm.$$http("editCarPower", sendData).then((results) => {
                vm.pageLoading = false;
                if (results.data.code == 0) {
                  vm.$router.push({ path: "/orders/pickupOrders/ordersList?goTo=determine" });
                }
              }).catch((err) => {
                this.pageLoading = false;
              });
            })
          }
        } else {
          vm.$confirm('订单数据已更新，请重新操作', '请注意', {
            confirmButtonText: '确认',
            showCancelButton: false,
            type: 'warning',
            center: true,
            closeOnClickModal: false,
            showClose: false,
            closeOnPressEscape: false
          }).then(() => {
            vm.$router.go(0);
          })
        }
      });
    },
    judgeIsDataChange: function(callbackFun) {
      var vm = this;
      this.$$http('searchOrderHasPower', { id: this.id }).then((results) => {
        if (results.data && results.data.code == 0) {
          var returnFlag = true;
          var nowData = {};
          if (results.data.data.add_capacities) {
            nowData = results.data.data;
          } else {
            nowData = {
              add_capacities: [],
              del_capacities: []
            }
          }
          //最新的列表
          if (nowData.add_capacities.length != vm.alreadyList.add_capacities.length || nowData.del_capacities.length != vm.alreadyList.del_capacities.length) {
            returnFlag = false;
            callbackFun(0);
          } else {
            for (var addIndex in vm.alreadyList.add_capacities) {
              if (nowData.add_capacities.indexOf(vm.alreadyList.add_capacities[addIndex]) == -1) {
                callbackFun(0);
                returnFlag = false;
                break;
              }
            }
            for (var delIndex in vm.alreadyList.del_capacities) {
              if (nowData.del_capacities.indexOf(vm.alreadyList.del_capacities[delIndex]) == -1) {
                returnFlag = false;
                callbackFun(0);
                break;
              }
            }
          }
          if (returnFlag) {
            callbackFun(1);
          }
        }
      }).catch((err) => {
        callbackFun(0);
      });
    },
    getList: function() {
      var vm = this;
      let postData = {
        pagination: false,
        complete_status: true
      };
      this.pageLoading = true;
      var getDataNum = 0;

      vm.$$http('searchCapacityList', postData).then((results) => {

        if (results.data && results.data.code == 0) {
          vm.tractor_semitrailers_List = results.data.data;
        }
        getDataNum++;
        if (getDataNum == 4) {
          vm.pageLoading = false;
          vm.sortData(true);
        }
      }).catch((err) => {
        getDataNum++;
        vm.sortData(false);
        if (getDataNum == 4) {
          vm.pageLoading = false;
        }
      });
      let postData1 = {
        id: this.id
      };
      vm.$$http('getPickOrderDetail', postData1).then((results) => {
        getDataNum++;

        if (results.data && results.data.code == 0) {

          vm.delivery_list = results.data.data;
        }
        if (getDataNum == 4) {
          vm.pageLoading = false;
          vm.sortData(true);
        }
      }).catch((err) => {
        getDataNum++;
        vm.sortData(false);
        if (getDataNum == 4) {
          vm.pageLoading = false;
        }

      });
      let postData2 = {};
      vm.$$http('searchNoUse', postData2).then((results) => {
        if (results.data && results.data.code == 0) {

          vm.upTo_list = results.data.data;
        }
        getDataNum++;
        if (getDataNum == 4) {
          vm.pageLoading = false;
          vm.sortData(true);
        }
      }).catch((err) => {
        getDataNum++;
        vm.sortData(false);
        if (getDataNum == 4) {
          vm.pageLoading = false;
        }

      });
      let postData4 = {
        id: vm.id
      };
      vm.$$http('searchOrderHasPower', postData4).then((results) => {
        if (results.data && results.data.code == 0) {

          vm.alreadyList = results.data.data;
          if (!results.data.data || !vm.alreadyList.capacities) {
            vm.alreadyList.add_capacities = [];
            vm.alreadyList.capacities = [];
            vm.alreadyList.del_capacities = [];
          }
        }
        getDataNum++;
        if (getDataNum == 4) {
          vm.pageLoading = false;
          vm.sortData(true);
        }
      }).catch((err) => {
        getDataNum++;
        vm.sortData(false);
        if (getDataNum == 4) {
          vm.pageLoading = false;
        }

      });

    },
    sortData: function(status) {
      if (status) {
        let operationArr = this.pbFunc.deepcopy(this.tractor_semitrailers_List);
        let newArr = [];
        let fifterArr = [];
        for (let i = 0; i < operationArr.length; i++) { //循环所有运力列表
          var addflag = false;
          for (let j = 0; j < this.delivery_list.trips.length; j++) { //筛选当前订单的列表
            //筛选
            if (operationArr[i].id == this.delivery_list.trips[j].capacity) {
              operationArr[i].waybill = this.delivery_list.trips[j];
              if (this.delivery_list.trips[j].status != "canceled" && this.delivery_list.trips[j].waybill_change_status != "canceled") {
                operationArr[i].isDisable = false;
                this.now_capacities.push(operationArr[i]);
                operationArr[i].bindCheckBox = true;
                addflag = true;
              } else if (this.delivery_list.trips[j].waybill_change_status == "canceled") {
                operationArr[i].isDisable = true;
                operationArr[i].bindCheckBox = false;
                this.default_del_capacities.push(operationArr[i].id);
                addflag = true;
              }
            }
          }
          if (addflag) {
            newArr.push(operationArr[i]);
          } else {
            fifterArr.push(operationArr[i]);
          }
        }
        console.log('one',this.now_capacities);
        fifterArr.forEach((item) => {
          if (!item.waybill) {
            item.waybill = {};
          }
        });
        //筛选出待确认列表中不在已确认列表的数据 加入到绑定选择列表 并且删除
        var fifterArr4 = [];
        for (let findex1 = 0; findex1 < fifterArr.length; findex1++) {
          var addAlreaListflag = false;
          for (let findex4 = 0; findex4 < this.alreadyList.add_capacities.length; findex4++) {
            if (fifterArr[findex1].id == this.alreadyList.add_capacities[findex4]) {
              addAlreaListflag = true;
              break;
            }
          }
          if (addAlreaListflag) {
            fifterArr[findex1].bindCheckBox = true;
            this.now_capacities.push(fifterArr[findex1]);
            newArr.push(fifterArr[findex1]);
          } else {
            fifterArr4.push(fifterArr[findex1]);
          }
        }
        console.log('two',this.now_capacities);
        //筛选出最近三天没有使用过的运力
        var fifterArr2 = [];
        for (var findex = 0; findex < fifterArr4.length; findex++) {
          var upaddfalg = false;
          for (let o = 0; o < this.upTo_list.length; o++) {
            if (fifterArr4[findex].id == this.upTo_list[o]) {
              upaddfalg = true;
              break;
            }
          }
          if (!upaddfalg) {
            if (!fifterArr4[findex].waybill) {
              fifterArr4[findex].waybill = {};
            }
            newArr.push(fifterArr4[findex]);
          } else {
            fifterArr2.push(fifterArr4[findex]);
          }
        }
        // var newArr1 = [];
        // for (let m = 0; m < operationArr.length; m++) {
        //   var addflag = true;
        //   for (let n = 0; n < newArr.length; n++) {
        //     if (newArr[n].id == operationArr[m].id) {
        //       addflag = false;
        //     }
        //   }
        //   if (addflag) {
        //     operationArr[m].waybill = {};
        //     newArr1.push(operationArr[m]);
        //   }
        // }
        newArr = newArr.concat(fifterArr2);
        if (this.delivery_list.status.key == 'canceled') {
          newArr.forEach(item => {
            item.isDisable = true;
          });
        }

        this.trueAll_list = newArr;
        this.renderAll_list = newArr;

        this.bindChekboxFunction(0, this.renderAll_list);
      } else {

      }
    },
    searchThisByData: function(searchPage, type) {
      var keyArr = this.searchFilters.field == '' ? [] : this.searchFilters.field.split(".");
      var value = this.searchFilters.keyword;
      var newArr = [];
      if (keyArr.length == 0) {
        newArr = this.trueAll_list;
      } else {
        for (let i = 0; i < this.trueAll_list.length; i++) {
          var searchParam = this.pbFunc.deepcopy(this.trueAll_list[i]);
          for (let j = 0; j < keyArr.length; j++) {
            searchParam = searchParam[keyArr[j]];
          }
          if (searchParam.indexOf(value) > -1) {
            newArr.push(this.trueAll_list[i]);
          }
        }
      }
      if (type == 'pageChange') {
        newArr = this.lastSearch_list;
      }
      this.renderAll_list = newArr;
      this.bindChekboxFunction(searchPage, newArr);
    },
    bindChekboxFunction: function(page, list) {
      this.pageData.totalPage = Math.ceil(list.length / this.pageData.pageSize);
      this.lastSearch_list = list;
      var vm = this;
      var page_list = this.pbFunc.deepcopy(list).splice(page * this.pageData.pageSize, this.pageData.pageSize);

      this.renderPage_list = page_list;
      var rowsArr = [];
      page_list.forEach((item, index) => {
        if (item.bindCheckBox) {
          rowsArr.push(item);
        }
      });
      var vm = this;
      setTimeout(function() {
        rowsArr.forEach(row => {
          vm.$refs.multipleTable.toggleRowSelection(row, true);
          vm.start_capacities.push(row.waybill.capacity ? row.waybill : row);
        });
      });
    },
    pageChange: function() {
      setTimeout(() => {
        this.searchThisByData(this.pageData.currentPage - 1, 'pageChange');
      })
    }
  },
  activated: function() {
    this.activeName = 'first';
  },
  created: function() {
    this.getList();
  },
  watch: {
    '$route' (to, from) {
      //刷新参数放到这里里面去触发就可以刷新相同界面了
      this.$router.go(0);
    }
  }
}

</script>
