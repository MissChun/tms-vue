<style scoped lang="less">
  .detail-main .el-form-item {
  .unit-free {
    right: -38px;
  }
  .unit-price {
    right: -58px;
  }
}
</style>
<template>
  <div id="addPerson" class="detail-main">
    <el-container v-loading="pageLoading">
      <el-header>
        <el-row>
          <el-col :span="2" class="left-arrow-d">
            <div class="go-return icon-back" @click="returnToPage"></div>
          </el-col>
          <el-col :span="20">
            <p>{{titleType}}</p>
          </el-col>
        </el-row>
      </el-header>
      <el-main v-show="!pageLoading" class="mt-30">
        <el-form class="addheaduserform detail-form" label-width="120px" ref="addFormSetpOne" :rules="rules" :model="customerMsgForm" status-icon>
          <transition name="el-fade-in-linear">
            <div>
              <div class="detail-form-title text-center">基础信息</div>
              <div style="margin:30px 2%">
                <el-row :gutter="40">
                  <el-col :span="8">
                    <el-form-item label="托运方名称:" prop="name">
                      <el-input placeholder="请输入" type="text" v-model="customerMsgForm.name"></el-input>
                      <!-- <el-row>
                        <el-col :span="8">
                          <el-select v-model="addType" placeholder="请选择" @change="selectAddType">
                            <el-option v-for="(item,key) in selectData.addTypeSelect" :key="key" :label="item.value" :value="item.id"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="16">
                          <el-row>
                            <el-col :span="12" v-if="addType==='PLAT'">
                              <el-select v-model="selectCustomer" @change="getSelectInfo" filterable placeholder="请选择">
                                <el-option v-for="(item,key) in customerList" :key="key" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="12">

                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系人:" prop="contact_name">
                      <el-input placeholder="请输入" type="text" :disabled="isDisabled" v-model="customerMsgForm.contact_name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系方式:" prop="contact_phone">
                      <el-input placeholder="请输入" :disabled="isDisabled" type="text" v-model="customerMsgForm.contact_phone"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="8">
                    <el-form-item label="地址:">
                      <el-input placeholder="请输入" :disabled="isDisabled" type="text" v-model="customerMsgForm.detail_address"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="亏吨标准:" prop="deficiency_standard">
                      <el-input placeholder="请输入" type="text" v-model="customerMsgForm.deficiency_standard"></el-input>
                      <span class="unit">KG</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="false">
                    <el-form-item label="营业执照:">
                      <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview
                      " :on-remove="handleRemove" :file-list="customerMsgForm.license_pic" list-type="picture">
                        <el-button size="small" type="primary" plain>上传图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="社会机构代码:" prop="codeMsg">
                      <el-row>
                        <el-col :span="10">
                          <el-select v-model="customerMsgForm.code" @change="codeTab" placeholder="请选择" :disabled="customerMsgForm.code==='license_code'&&customerMsgForm.codeMsg?true:false">
                            <el-option v-for="(item,key) in selectData.codeSelect" :key="key" :label="item.value" :value="item.id"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="14">
                          <el-input placeholder="请输入" type="text" v-model="customerMsgForm.codeMsg"></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </transition>
          <transition name="el-fade-in-linear">
            <div>
              <div class="detail-form-title text-center">卸车待时规则</div>
              <div style="margin:30px 2%">
                <el-row :gutter="40">
                  <el-col :span="8">
                    <el-form-item label="免费等待时长:" prop="free_hour">
                      <el-input placeholder="请输入" :disabled="isDisabled" type="text" v-model="customerMsgForm.free_hour"></el-input>
                      <span class="unit unit-free">小时</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="超时计算单价:" prop="overtime_price">
                      <el-input placeholder="请输入" type="text" :disabled="isDisabled" v-model="customerMsgForm.overtime_price"></el-input>
                      <span class="unit unit-price">元/小时</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="detail-btn">
                <el-row>
                  <el-col :span="12" :offset="6" class="text-center">
                    <el-button type="primary" @click="editBasics(saveBasicAndReviewBtn)" :loading="saveBasicAndReviewBtn.isLoading" :disabled="saveBasicAndReviewBtn.isDisabled">{{saveBasicAndReviewBtn.btnText}}</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </transition>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "editShipper",
  computed: {
    titleType: function() {
      return this.$route.query.id ? "编辑托运方" : "新增托运方";
    },
    id: function() {
      return this.$route.query.id || "";
    },
    returnPage: function() {
      return this.$route.query.id ? "详情页" : "列表页";
    }
  },
  data() {
    return {
      pageLoading: false,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      addType: "OWN",
      selectCustomer: "",
      customerMsgForm: {
        name: "",
        contact_name: "",
        contact_phone: "",
        detail_address: "",
        deficiency_standard: "",
        free_hour: "",
        overtime_price: "",
        code: "license_code",
        codeMsg: "",
        license_pic: []
      },
      sociology: [
        { required: true, message: "请输入机构代码", trigger: "blur" },
        {
          pattern: /^([A-Z0-9]{18})$/,
          message: "由18位数字和大写字母组成",
          trigger: "blur"
        }
      ],
      structure: [
        { required: true, message: "请输入机构代码", trigger: "blur" },
        {
          pattern: /^([A-Z0-9]{8})$/,
          message: "由8位数字和大写字母组成",
          trigger: "blur"
        }
      ],
      selectData: {
        codeSelect: [
          { id: "license_code", value: "统一社会机构代码（三合一）" },
          { id: "organization_code", value: "组织机构代码（非三合一）" }
        ],
        addTypeSelect: [
          { id: "OWN", value: "默认新增" },
          { id: "PLAT", value: "选择已有" }
        ]
      },
      rules: {
        name: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          { min: 1, max: 50, message: "客户名称为1~50个字符", trigger: "blur" }
        ],
        contact_name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          { min: 2, max: 20, message: "联系人为2~10个字符", trigger: "blur" }
        ],
        deficiency_standard: [
          // { required: true, message: '请输入亏吨标准', trigger: 'blur' },
          {
            pattern: /^[0-9]+(.[0-9]{0,2})?$/,
            message: "支持数值输入，最多支持小数点后2位",
            trigger: "blur"
          }
        ],
        free_hour: [
          { required: true, message: "请输入免费等待时长", trigger: "blur" },
          {
            pattern: /^[0-9]+(.[0-9]{0,2})?$/,
            message: "支持数值输入，最多支持小数点后2位",
            trigger: "blur"
          }
        ],
        overtime_price: [
          // { required: true, message: "请输入超时计算单价", trigger: "blur" },
          {
            pattern: /^[0-9]+(.[0-9]{0,2})?$/,
            message: "支持数值输入，最多支持小数点后2位",
            trigger: "blur"
          }
        ],
        contact_phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern: /(^(\(0\d{2,3}\)|0\d{2,3}-|\s)?\d{7,8}$)|(^1\d{10}$)/,
            message: "请输入座机号或者手机号",
            trigger: "blur"
          }
        ],
        codeMsg: [
          { required: true, message: "请输入机构代码", trigger: "blur" },
          {
            pattern: /^([A-Z0-9]{18})$/,
            message: "由18位数字和大写字母组成",
            trigger: "blur"
          }
        ]
      },
      saveBasicAndReviewBtn: {
        isLoading: false,
        btnText: "保存并退出",
        isDisabled: false
      },
      detail: {},
      customerList: [],
      isDisabled: false
    };
  },
  created() {
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    codeTab() {
      this.customerMsgForm.codeMsg = "";
      this.$refs["addFormSetpOne"].clearValidate();
      if (this.customerMsgForm.code === "license_code") {
        this.rules.codeMsg = this.sociology;
      } else {
        this.rules.codeMsg = this.structure;
      }
    },
    returnToPage: function() {
      if (this.$route.query.id) {
        this.$router.push({
          path: `/basicDataManage/shipperManage/shipperDetail/${
            this.$route.query.id
          }`
        });
      } else {
        this.$router.push({
          path: "/basicDataManage/shipperManage/shipperManageList"
        });
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    selectAddType() {
      if (this.addType !== "PLAT") {
        this.isDisabled = false;
        this.selectCustomer = "";
        this.customerMsgForm = {
          name: "",
          contact_name: "",
          contact_phone: "",
          detail_address: "",
          deficiency_standard: "",
          free_hour: "",
          overtime_price: "",
          code: "license_code",
          codeMsg: "",
          license_pic: []
        };
      }
    },
    getSelectInfo() {
      if (this.addType === "PLAT") {
        this.isDisabled = true;
        for (let i in this.customerList) {
          if (this.customerList[i].id === this.selectCustomer) {
            this.customerMsgForm = {
              name: this.customerList[i].name,
              contact_name: this.customerList[i].contact_name,
              contact_phone: this.customerList[i].contact_phone,
              detail_address: this.customerList[i].detail_address,
              deficiency_standard: this.customerList[i].deficiency_standard,
              free_hour: this.customerList[i].free_hour,
              overtime_price: this.customerList[i].overtime_price,
              code: this.customerList[i].license_code ?
                "license_code" : "organization_code",
              codeMsg: this.customerList[i].license_code ?
                this.customerList[i].license_code : this.customerList[i].organization_code,
              license_pic: this.customerList[i].license_pic ?
                this.customerList[i].license_pic : []
            };
          }
        }
      }
    },
    getDetail: function() {
      this.$$http("getCustomerDetail", { customer_id: this.id }).then(
        results => {
          if (results.data && results.data.code == 0) {
            this.detail = results.data.data;
            // this.addType = this.detail.customer_type;
            if (this.detail.customer_type === "PLAT") {
              this.isDisabled = true;
            }
            this.customerMsgForm = {
              name: this.detail.name,
              contact_name: this.detail.contact_name,
              contact_phone: this.detail.contact_phone,
              detail_address: this.detail.detail_address,
              deficiency_standard: this.detail.deficiency_standard,
              free_hour: this.detail.free_hour,
              overtime_price: this.detail.overtime_price,
              code: this.detail.organization_code ?
                "organization_code" : "license_code",
              codeMsg: this.detail.organization_code ?
                this.detail.organization_code : this.detail.license_code,
              license_pic: this.detail.license_pic ?
                this.detail.license_pic : []
            };
            if (this.customerMsgForm.code === "license_code") {
              this.rules.codeMsg = this.sociology;
            } else {
              this.rules.codeMsg = this.structure;
            }
          }
        }
      );
    },
    editAjax(postData, formName, btnObject) {
      let btnTextCopy = this.pbFunc.deepcopy(btnObject).btnText;
      let apiName = "addCustomer";
      btnObject.isDisabled = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          /* 如果id存在则为编辑 */
          if (this.id) {
            postData.customer_id = this.id;
            // postData.customer_type = this.detail.customer_type;

            apiName = "updateCustomer";
          }

          btnObject.btnText = "正在提交";
          btnObject.isLoading = true;

          //postData = this.pbFunc.fifterObjIsNull(postData);

          this.$$http(apiName, postData)
            .then(results => {
              btnObject = {
                btnText: btnTextCopy,
                isLoading: false,
                isDisabled: false,
              }
              if (results.data && results.data.code == 0 && results.data.data) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                if (this.$route.query.id) {
                  this.$router.push({
                    path: `/basicDataManage/shipperManage/shipperDetail/${
                        results.data.data.id
                      }`
                  });
                } else {
                  this.$router.push({
                    path: "/basicDataManage/shipperManage/shipperManageList"
                  });
                }
              }
            })
            .catch(err => {
              btnObject = {
                btnText: btnTextCopy,
                isLoading: false,
                isDisabled: false,
              }
            });
        } else {
          btnObject.isDisabled = false;
        }
      });
    },
    editBasics(btn, btnType) {
      let formName = "addFormSetpOne";
      let btnObject = btn;
      let keyArray = [
        "name",
        "contact_name",
        "contact_phone",
        "detail_address",
        "deficiency_standard",
        "code",
        "free_hour",
        "overtime_price",
        "codeMsg"
      ];
      let postData = this.pbFunc.fifterbyArr(this.customerMsgForm, keyArray);
      if (postData.code === "license_code") {
        postData.license_code = postData.codeMsg;
      } else if (postData.code === "organization_code") {
        postData.organization_code = postData.codeMsg;
      }
      postData.customer_type = "OWN";
      this.editAjax(postData, formName, btnObject);
    },
  }
};

</script>
