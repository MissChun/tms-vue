<!-- 卸车榜单审核组件 -->
<!--
  本组件成灾功能：
  1:纯展示不能审核：isEdit = false;
  2:可以审核不能上传装车榜单图片isedit = ture ; isUpload = false;
  3:可以审核并能上传装车榜单图片isedit = ture ; isUpload = ture;
 -->
<style scoped lang="less">
  .loading-review-container {
     max-height:720px;
     overflow:auto;
  /deep/ .el-date-editor.el-input {
    width: 100%;
   
  }
}

.checked-box {
  position: absolute;
  left: 100px;
  top: 10px;
  color: #f56c6c;
}

</style>
<template>
  <div class="loading-review-container">
    <el-form ref="examinePoundForm" :model="surePound" :rules="rules" status-icon :label-position="'right'" label-width="100px">
      <el-row v-if="setpTipInfo.length>0">
        <el-col :span="20" :offset="2" style="text-align:center;color:#F56C6C">
          请注意，该单与
          <span v-for="(item,index) in setpTipInfo">
              {{item.order_number}}({{item.station}})
              <span v-if="index!=setpTipInfo.length-1">/</span>
          </span>
          合为分卸单,请注意卸车信息填写！
        </el-col>
      </el-row>
      <el-row v-if="!isUpload" style="margin-top:10px;">
        <el-col :span="20" :offset="2">
          <el-row style="min-height: 110px;">
            <el-col :span="5" :offset="1" v-for="item in imgList" :key="item.id">
              <router-link target="_blank" :to="imgReviewSrc">
                <img :src="item" style='width:100%;max-height:100px'></img>
              </router-link>
            </el-col>
          </el-row>
          <el-col :span="20" :offset="2">
          </el-col>
        </el-col>
      </el-row>
      <el-row v-if="isUpload">
        <el-col :span="20" :offset="2">
          <qiniuImgUpload :fileList.sync="poundUpload.fileList" :uploadTitle="poundUpload.uploadTitle" :limit="poundUpload.limit"></qiniuImgUpload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <router-link target="_blank" :to="imgReviewSrc">
            <img :src="surePound.image_url" style='width:100%;max-height:500px'></img>
          </router-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="计划到站时间:">
            {{surePound.business_order && surePound.business_order.plan_arrive_time || surePound.plan_time}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="实际到站时间:" label-width="120px" prop="active_time">
            <el-date-picker v-if="isEdit" v-model="surePound.active_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span v-if="!isEdit">{{surePound.active_time || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="计划站点:">
            {{surePound.business_order && surePound.business_order.station || surePound.station}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卸车完成时间:" label-width="120px">
            <el-date-picker v-if="isEdit" v-model="surePound.work_end_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span v-if="!isEdit">{{surePound.work_end_time || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="站点地址:">
            {{surePound.business_order && surePound.business_order.station_address || surePound.station_address}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="离站时间:" label-width="120px" prop="leave_time">
            <el-date-picker v-if="isEdit" v-model="surePound.leave_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span v-if="!isEdit">{{surePound.leave_time || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="计划卸车吨位:">
            {{surePound.business_order && surePound.business_order.plan_tonnage || surePound.plan_tonnage}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="实际里程:" label-width="120px" prop="weight_active_mile">
            <el-input v-if="isEdit" placeholder="请输入" type="text" v-model="surePound.weight_active_mile"></el-input>
            <span v-if="!isEdit">{{surePound.weight_active_mile || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="计划卸车车号:">
            {{surePound.transPowerInfo && surePound.transPowerInfo.tractor && surePound.transPowerInfo.tractor.plate_number || surePound.plate_number}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卸车毛重(吨):" label-width="120px" prop="gross_weight">
            <el-input v-if="isEdit" placeholder="请输入" type="text" v-model="surePound.gross_weight"></el-input>
            <span v-if="!isEdit">{{surePound.gross_weight || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="主驾:">
            <span>{{surePound.transPowerInfo && surePound.transPowerInfo.master_driver && surePound.transPowerInfo.master_driver.name ||surePound.master_driver}}&nbsp;&nbsp;{{surePound.transPowerInfo && surePound.transPowerInfo.master_driver && surePound.transPowerInfo.master_driver.mobile_phone ||surePound.master_driver_phone}}</span>
            <span v-if="surePound.transPowerInfo && surePound.transPowerInfo.group && surePound.transPowerInfo.group.group_name">/{{surePound.transPowerInfo && surePound.transPowerInfo.group && surePound.transPowerInfo.group.group_name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卸车皮重(吨):" label-width="120px" prop="tare_weight">
            <el-input v-if="isEdit" placeholder="请输入" type="text" v-model="surePound.tare_weight"></el-input>
            <span v-if="!isEdit">{{surePound.tare_weight || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="副驾/押运:">
            <span>{{surePound.transPowerInfo && surePound.transPowerInfo.vice_driver && surePound.transPowerInfo.vice_driver.name || surePound.copilot_name}}&nbsp;&nbsp;{{surePound.transPowerInfo && surePound.transPowerInfo.vice_driver && surePound.transPowerInfo.vice_driver.mobile_phone || surePound.copilot_driver_phone}}</span>
            <br v-if="(surePound.transPowerInfo && surePound.transPowerInfo.vice_driver && surePound.transPowerInfo.vice_driver.name) || surePound.copilot_name">
            <span>{{surePound.transPowerInfo && surePound.transPowerInfo.escort_staff && surePound.transPowerInfo.escort_staff.name || surePound.supercargo_name}}&nbsp;&nbsp;{{surePound.transPowerInfo && surePound.transPowerInfo.escort_staff && surePound.transPowerInfo.escort_staff.mobile_phone || surePound.supercargo_phone}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卸车净重(吨):" label-width="120px" prop="net_weight">
            <el-input v-if="isEdit" placeholder="请输入" type="text" v-model="surePound.net_weight"></el-input>
            <span v-if="!isEdit">{{surePound.net_weight || '无'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isEdit">
        <el-col :span="24">
          <el-form-item label="备注:" prop="mark">
            <el-input type="textarea" :rows="4" v-model="surePound.mark" style="width:90%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center; position: relative;" v-if="isEdit">
      <el-checkbox v-model="checked" class="checked-box" v-if="isShowAccountCheck&&(!surePound.isHideUpSettle)">同时提交结算</el-checkbox>
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="sendRe()" :loading="buttonLoading">确 定</el-button>
    </div>
  </div>
</template>
<script>
import qiniuImgUpload from '@/components/qiniuImgUpload';
export default {
  name: 'unloadingReview',
  components: {
    qiniuImgUpload,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value >= 0.1 && value < 31) {
        callback();
      } else {
        callback(new Error("请注意单位为吨"));
      }
    };
    return {
      buttonLoading: false,
      imgList: [],
      surePound: {

      },

      poundUpload: {
        fileList: [],
        uploadTitle: '上传磅单',
        limit: 1,
      },
      poundReturnId: '',
      setpTipInfo: [],
      rules: {
        active_time: [
          { required: true, message: '请选择实际到厂时间', trigger: 'change' },
        ],
        leave_time: [
          { required: true, message: '请选择离站时间', trigger: 'change' },
        ],
        weight_active_mile: [
          { required: true, message: '请输入实际里程', trigger: 'blur' },
          { pattern: /^\d+(\.\d+)?$/, message: '请非负的数字', trigger: 'blur' },
        ],
        gross_weight: [
          { pattern: /^\d+(\.\d{1,3})?$/, message: '不超过三位小数', trigger: 'blur' },
        ],
        tare_weight: [
          { pattern: /^\d+(\.\d{1,3})?$/, message: '不超过三位小数', trigger: 'blur' },
        ],
        net_weight: [
          { required: true, message: '请输入卸车净重', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
          //{ pattern: /^[1-9][0-9]?(\.\d{1,3})?$/, message: '请注意单位为吨', trigger: 'blur' },
        ],
        mark: [
          { min: 1, max: 100, message: '备注不超过100字符', trigger: 'blur' }
        ]
      },
      checked: false,

    };
  },
  props: {
    surePoundData: Object,
    successCallback: Function,
    cancel: Function,
    isEdit: Boolean,
    isUpload: Boolean,
    isShowAccountCheck: Boolean,
    checkStep: String
  },
  computed: {
    imgReviewSrc: function() {
      return `/imgReview?imgList=${this.imgList.join(',')}`;
    }
  },
  methods: {
    getImg() {
      let qustArray = [];
      this.imgList = [];
      //获取卸车榜单
      if (this.surePound.weight_note) {
        this.$$http("getPundList", { id: this.surePound.weight_note }).then(results => {
          if (results.data.code == 0) {
            let imageUrlArray = results.data.data.data;
            imageUrlArray.map((img, i) => {
              this.imgList.push(img.image_url);
            })
          }
        });
      }

    },
    uploadPoundImg() {
      return new Promise((resolve, reject) => {
        if (this.poundUpload.fileList.length) {
          let imgUrlArray = [];
          for (let i in this.poundUpload.fileList) {
            imgUrlArray.push(this.poundUpload.fileList[i].url);
          }
          let postData = {
            section_trip: this.surePoundData.id,
            image_url: imgUrlArray.join(','),
          };
          this.$$http("postPundList", postData).then(results => {
            if (results.data.code == 0) {
              this.poundReturnId = results.data.data.id;
              resolve(results)
            } else {
              reject(results);
            }
          }).catch(err => {
            reject(err);
          })
        }

      })

    },
    confrimEdit() {
      if (this.surePound.mark !== this.surePoundData.mark) {
        let sendData = {
          id: this.surePound.deliveryOrderId,
          mark: this.surePound.mark,
        };
        this.$$http("fixOrderMark", sendData)
      }
    },
    sendReAjax() {

      if (!this.surePound.weight_note && !this.poundReturnId) return;

      let sendData = {
        active_time: this.surePound.active_time,
        //work_start_time: this.surePound.work_start_time,
        work_end_time: this.surePound.work_end_time,
        gross_weight: this.surePound.gross_weight,
        tare_weight: this.surePound.tare_weight,
        net_weight: this.surePound.net_weight,
        leave_time: this.surePound.leave_time || null,
        active_mile: this.surePound.weight_active_mile || null,
        is_checked: 'pass',
        id: this.isUpload ? this.poundReturnId : this.surePound.weight_note,
      };

      this.$$http("examineLoad", sendData).then(results => {
        this.buttonLoading = false;
        if (results.data.code == 0) {

          if (this.checked) {
            const postData = {
              arrival_time: this.surePound.active_time,
              weight_audit_time: this.surePound.leave_time,
              net_weight: this.surePound.net_weight,
              active_mile: this.surePound.weight_active_mile,
              status: 'in_settlement',
              id: this.surePound.id
            }
            this.$$http('changeOrderStatus', postData).then((results) => {
              if (results.data.code == 0) {
                this.$message({
                  message: '审核通过并结算成功',
                  type: 'success'
                });
                this.$emit('successCallback');
                this.$emit('close');
              }
            })
          } else {
            this.$message({
              type: "success",
              message: "审核通过成功"
            });
            this.$emit('successCallback');
            this.$emit('close');
          }


        }
      }).catch((err) => {
        this.buttonLoading = false;
      });

    },
    sendRe() { //审核通过

      if (this.isUpload && !this.poundUpload.fileList.length) {
        this.$message({
          type: "success",
          message: "请上传磅单",
        });
        return;
      };

      this.$refs['examinePoundForm'].validate(valid => {

        if (!valid) return;

        this.buttonLoading = true;

        this.confrimEdit();

        if (this.isUpload) {
          this.uploadPoundImg().then(results => {
            this.sendReAjax();
          }).catch(() => {
            this.buttonLoading = false;
          });
        } else {
          this.sendReAjax();
        }

      })

    },
    getCheckStep() {
      var sendData = {};
      sendData.id = this.surePoundData.id;
      this.$$http('getCheckStep', sendData).then(results => {
        if (results.data.code == 0) {
          this.setpTipInfo = results.data.data;
        }
      });
    }
  },

  created() {

    this.surePound = Object.assign({}, this.surePoundData);

    !this.isUpload && this.getImg();
    this.isedit && this.getCheckStep();
  },
  watch: {
    surePoundData: {
      handler(val, oldVal) {
        console.log('val', val);
        this.surePound = Object.assign({}, this.surePoundData);
        !this.isUpload && this.getImg();
        this.isedit && this.getCheckStep();
        this.poundUpload = {
          fileList: [],
          uploadTitle: '上传磅单',
          limit: 1,
        };
      },
      deep: true
    },
  }
};

</script>
