<style scoped lang="less">
.el-header p {
  font-size: 25px;
  text-align: center;
  height: 80px;
  line-height: 80px;
  margin: 0 0;
}

.el-main {
  text-align: center;
  .el-form {
    margin: 0 auto;
    width: 340px;
    .el-input,
    .el-autocomplete,
    .el-select {
      width: 100%;
    }
  }
}

#addeditHeadCarPage {
  border: 1px solid rgb(222, 222, 222);
}

.alone-insurance-form {
  border: 1px solid rgb(222, 222, 222);
  border-top: none;
  padding: 30px 30px 0 20px;
}

.insurance-form-head {
  background-color: #f1f1f1;
  height: 41px;
  line-height: 41px;
}

#addeditHeadCarPage {
  background-color: white;
}

.icon-arrow-lift {
  font-size: 35px;
  color: rgb(222, 222, 222);
  vertical-align: middle;
}

.right-arrow-d {
  height: 80px;
  line-height: 80px;
  text-align: center;
  pointer: cursor;
}

.icon-down-arrow {
  font-size: 35px;
  color: rgb(222, 222, 222);
  vertical-align: middle;
  transform: rotate(90deg);
  display: inline-block;
}

.left-arrow-d {
  height: 80px;
  line-height: 80px;
  text-align: center;
  cursor: pointer;
}

.stepTitle {
  background-color: rgb(235, 238, 245);
  height: 40px;
  text-align: center;
  font-size: 18px;
  line-height: 40px;
}

.force-submit-dialog {
  .el-dialog__body {
    padding-top: 6px;
    .notice-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .el-icon-warning {
        font-size: 30px;
        color: #e6a23c;
        margin: 24px 0 16px;
      }
    }
    .el-form {
      width: 340px;
      margin: 0 auto;
      h2 {
        text-align: center;
        font-weight: normal;
        padding-bottom: 46px;
        span {
          color: #4a9bf8;
        }
      }
      .el-form-item {
        .el-autocomplete {
          display: block;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}

</style>
<template>
  <div id="addeditHeadCarPage">
    <el-container>
      <el-header style="margin-top:15px;height:80px">
        <el-row>
          <el-col :span="1" class="left-arrow-d"><i class="icon-down-arrow" v-on:click="goDetail"></i></el-col>
          <el-col :span="22">
            <p>{{titleType}}</p>
          </el-col>
        </el-row>
      </el-header>
      <el-main v-loading="pageLoading">
        <transition name="el-fade-in-linear">
          <div v-if="activeStep==0">
            <el-form label-width="80px" :model="truckForm" ref="truckForm" :rules="truckRules">
              <el-row :gutter="80">
                <el-form-item label="挂车号">
                  <el-select v-model="truckForm.semitrailer" filterable clearable placeholder="请选择">
                    <el-option v-for="item in semiList" :key="item.id" :label="item.value" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row :gutter="80">
                <el-form-item label="随车电话">
                  <el-input v-model="truckForm.car_belong_phone" auto-complete="off"></el-input>
                </el-form-item>
              </el-row>
              <el-row :gutter="80">
                <el-form-item label="分组">
                  <el-select v-model="truckForm.group" clearable placeholder="请选择">
                    <el-option v-for="item in selectData.groupOptions" :key="item.id" :label="item.group_name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-form>
            <el-button type="primary" @click="submitTruckForm">保存</el-button>
          </div>
        </transition>
        <transition name="el-fade-in-linear">
          <div v-if="activeStep==1">
            <el-form :model="staffForm" ref="staffForm" label-width="70px" :rules="staffRules">
              <el-form-item label="主驾驶" prop="master_driver">
                <el-select v-model="staffForm.master_driver" filterable clearable placeholder="请选择">
                  <el-option v-for="item in driverList" :key="item.id" :label="item.value" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="副驾驶" prop="vice_driver">
                <el-select v-model="staffForm.vice_driver" filterable clearable placeholder="请选择" @change="validateStaff">
                  <el-option v-for="(item, index) in driverList" :key="index" :label="item.value" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="押运员" prop="escort_staff">
                <el-select v-model="staffForm.escort_staff" filterable clearable placeholder="请选择" @change="validateStaff">
                  <el-option v-for="(item, index) in escortList" :key="index" :label="item.value" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="submitStaffForm">保存</el-button>
          </div>
        </transition>
        <el-dialog custom-class="force-submit-dialog" title="强制绑定挂车" :visible.sync="forceTruckFormVisible" append-to-body center>
          <div class="notice-msg">
            <i class="el-icon-warning"></i>
            <pre class="notice-msg">{{truckForm.noticeMsg}}</pre>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="forceTruckFormVisible=false">取消</el-button>
            <el-button type="primary" @click="forceSubmitTruckForm">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog custom-class="force-submit-dialog" title="强制绑定人员" :visible.sync="forceStaffFormVisible" append-to-body center>
          <div class="notice-msg">
            <i class="el-icon-warning"></i>
            <pre class="notice-msg">{{staffForm.noticeMsg}}</pre>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="forceStaffFormVisible=false">取消</el-button>
            <el-button type="primary" @click="forceSubmitStaffForm">确定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'editCapacity',
  data() {
    let validateViceDriver = (rule, value, callback) => {
      if (!value && !this.staffForm.escort_staff) {
        callback(new Error('副驾驶和押运员必填一个'))
      } else {
        callback();
      }
    };
    let validateEscortStaff = (rule, value, callback) => {
      if (!value && !this.staffForm.vice_driver) {
        callback(new Error('副驾驶和押运员必填一个'))
      } else {
        callback();
      }
    };
    return {
      pageLoading: true,
      truckForm: {},
      staffForm: {},
      forceTruckFormVisible: false,
      forceStaffFormVisible: false,
      truckRules: {
        semitrailer: [
          { required: true, message: '请输入挂车号', trigger: 'change' }
        ]
      },
      staffRules: {
        master_driver: [
          { required: true, message: '请输入主驾驶名称', trigger: 'change' }
        ],
        vice_driver: [
          { validator: validateViceDriver, trigger: 'change' }
        ],
        escort_staff: [
          { validator: validateEscortStaff, trigger: 'change' }
        ]
      },
      selectData: {
        groupOptions: []
      },
      semiList: [],
      driverList: [],
      escortList: [],
    }
  },
  computed: {
    capacityInfo: function() {
      return this.$route.params.capacityInfo;
    },
    capacityId: function() {
      return this.$route.params.id;
    },
    titleType: function() {
      return parseInt(this.$route.params.activeStep) === 0 ? '编辑绑定挂车' : '编辑绑定人员';
    },
    activeStep: function() {
      return parseInt(this.$route.params.activeStep);
    }
  },
  created() {

  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.setSelectData();
      this.getDetail()
    },
    getDetail: function() {
      this.$$http('getCapacityDetail', { id: this.capacityId }).then((results) => {
        if (results.data && results.data.code == 0) {
          this.headData = results.data.data;
          this.truckForm = {};
          this.staffForm = {};
          if (this.activeStep === 0) {
            this.truckForm = {
              capacityId: this.capacityId,
              semitrailer: this.headData.semitrailer && this.headData.semitrailer.id,
              car_belong_phone: this.headData.car_belong_phone || null,
              group: this.headData.group && this.headData.group.id
            }
          } else if (this.activeStep === 1) {
            this.staffForm = {
              capacityId: this.capacityId,
              master_driver: this.headData.master_driver && this.headData.master_driver.id,
              vice_driver: this.headData.vice_driver && this.headData.vice_driver.id,
              escort_staff: this.headData.escort_staff && this.headData.escort_staff.id
            }
          }
        } else {
          this.$message.error('数据获取失败');
        }
      }).catch(() => {
        this.$message.error('数据获取失败');
      })

    },
    setSelectData: function() {
      if (this.activeStep == 0) {
        let p1 = this.getGroups();
        let p2 = this.getSemiList();
        Promise.all([p1, p2]).then(results => {
          // 分组数据
          if (results[0].data.code === 0) {
            this.groupList = results[0].data.data.results;
            results[0].data.data.results.map((n, i) => {
              this.selectData.groupOptions.push(n);
            });
          }
          // 挂车数据
          if (results[1].data.code == 0) {
            results[1].data.data.map(((n, i) => {
              this.semiList.push({
                id: n.id,
                value: n.plate_number
              })
            }));
          }
          this.pageLoading = false;
        }).catch(err => {

        });
      } else {
        let p3 = this.getDriverList();
        let p4 = this.getEscortList();
        Promise.all([p3, p4]).then(results => {
          // 驾驶员数据
          if (results[0][0].data.code === 0 && results[0][1].data.code === 0) {
            results[0].map((res, i) => {
              res.data.data.map((n, j) => {
                this.driverList.push({
                  id: n.id,
                  value: n.name + "  " + n.mobile_phone
                });
                // 驾驶员/押运员添加进押运员数组
                if (i === 1) {
                  this.escortList.push({
                    id: n.id,
                    value: n.name + "  " + n.mobile_phone
                  });
                }
              });
            });
          }
          // 押运员数据
          if (results[1].data.code === 0) {
            results[1].data.data.map((n, i) => {
              this.escortList.push({
                id: n.id,
                value: n.name + "  " + n.mobile_phone
              });
            });
          }
          this.pageLoading = false;
        }).catch(err => {

        });
      }



    },
    getGroups: function() {
      return this.$$http('getGroups')
    },
    getSemiList: function() {
      return this.$$http('searchTailCarList', { pagination: false })
    },
    getDriverList: function() {
      let param1 = {
        work_type: 'DRIVER',
        pagination: false
      };
      let param2 = {
        work_type: 'DRIVER_ESCORT',
        pagination: false
      };
      let req1 = this.$$http('getDriversList', param1);
      let req2 = this.$$http('getDriversList', param2);
      return Promise.all([req1, req2])
    },
    getEscortList: function() {
      return this.$$http('getDriversList', { work_type: 'ESCORT', pagination: false })
    },
    submitTruckForm: function() {
      this.$refs.truckForm.validate((isValid, unvailidField) => {
        if (isValid) {
          let send = {
            id: this.truckForm.capacityId,
            semitrailer: this.truckForm.semitrailer,
            car_belong_phone: this.truckForm.car_belong_phone,
            group: this.truckForm.group
          }
          this.$$http('bindTruck', dealObjectValue(send), this.validteClientCallback).then((results) => {
            if (results.data.code === 0) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              });
              this.goDetail();
            } else if (results.data.code === 600) {
              this.forceTruckFormVisible = true;
              this.truckForm.noticeMsg = results.data.msg;
            }
          }).catch((err) => {

          });
        }
      });
    },
    submitStaffForm: function() {
      this.$refs.staffForm.validate((isValid, unvailidField) => {
        if (isValid) {
          let send = {
            id: this.staffForm.capacityId,
            master_driver: this.staffForm.master_driver,
            vice_driver: this.staffForm.vice_driver,
            escort_staff: this.staffForm.escort_staff
          }
          this.$$http('bindStaff', dealObjectValue(send), this.validteClientCallback).then((results) => {
            if (results.data.code === 0) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              });
              this.goDetail();
            } else if (results.data.code === 600) {
              this.forceStaffFormVisible = true;
              this.staffForm.noticeMsg = results.data.msg;
            }
          }).catch((err) => {

          });
        }
      });
    },
    forceSubmitTruckForm: function() {
      let send = {
        id: this.truckForm.capacityId,
        semitrailer: this.truckForm.semitrailer,
        car_belong_phone: this.truckForm.car_belong_phone,
        group: this.truckForm.group
      }
      this.$$http('forceBindTruck', dealObjectValue(send), this.validteClientCallback).then((results) => {
        if (results.data.code === 0) {
          this.$message({
            message: '绑定成功',
            type: 'success'
          });
          this.forceTruckFormVisible = false;
          this.goDetail();
        }
      }).catch((err) => {

      });
    },
    forceSubmitStaffForm: function() {
      let send = {
        id: this.staffForm.capacityId,
        master_driver: this.staffForm.master_driver,
        vice_driver: this.staffForm.vice_driver,
        escort_staff: this.staffForm.escort_staff
      }
      this.$$http('forceBindStaff', dealObjectValue(send), this.validteClientCallback).then((results) => {
        if (results.data.code === 0) {
          this.$message({
            message: '绑定成功',
            type: 'success'
          });
          this.forceStaffFormVisible = false;
          this.goDetail();
        }
      }).catch((err) => {

      });
    },
    goDetail: function() {
      if (this.activeStep === 0) {
        this.$refs.truckForm.resetFields();
      } else {
        this.$refs.staffForm.resetFields();
      }
      if (this.capacityId) {
        this.$router.push({ path: `/basicDataManage/capacityManage/transportManage/capacityDetail/${this.capacityId}/first` });
      }
    },
    validateStaff: function() {
      this.$refs.staffForm.validateField('vice_driver');
      this.$refs.staffForm.validateField('escort_staff');
    },
    validteClientCallback: function(res) {
      let reg = new RegExp('^(4[0-9]*)$')
      if (reg.test(res.data.code)) {
        this.$message({
          message: res.data.msg,
          type: 'error'
        });
      }
    }
  }
}

</script>
