<template lang="html">
  <div>
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">申请开票</div>
    </v-head>
    <div class="invoice-type">
      <div class="title">发票类型</div>
      <div class="type-box">
          <div class="invoice-item" :class="{ active : ticket_type==item.id }" @click.stop="ticketClick(item)" v-for="(item , index) in invoiceType" :key="index">{{ item.text }}</div>
      </div>
      <p class="invoice-tips">
        注：开票金额需满足10元才可开普通和专用发票
      </p>
    </div>
    <div class="material"  v-if="ticket_type==2">
      <div class="title">发票性质</div>
      <div class="material-type">
        <div class="material-item" :class="{ active : item.id==is_paper }" @click.stop="materialClick(item)" v-for="(item,index) in material" :key="index">{{ item.text }}</div>
      </div>
    </div>
    <div class="invoice-head">
      <div class="title">发票抬头</div>
      <div class="content">
        <div class="item">
          <div class="cnt-lt"><span>公司名称</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="公司名称，必填" v-model="title">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>识别号</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="纳税人识别号，必填" v-model="tax_number">
        </div>
      </div>
    </div>
    <div class="invoice-head" v-if="ticket_type==3">
      <div class="title">补充信息</div>
      <div class="content">
        <div class="item company-addressk">
          <x-address :title="'公司地址<i>*</i>'" v-model="company_region" :list="addressData" placeholder="请选择区域，必填"></x-address>
        </div>
        <div class="item">
          <div class="cnt-lt"><span>详细地址</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="详细地址，必填" v-model="company_address">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>公司电话</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="公司电话，必填" v-model="company_mobile">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>开户行</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="银行开户行，必填" v-model="bank">
        </div>
        <div class="item">
          <div class="cnt-lt"><span>开户账号</span><i class="require-icon">*</i></div>
          <input type="text" placeholder="银行开户账号，必填" v-model="account">
        </div>
      </div>
    </div>
    <div class="invoice-content">
      <div class="title">发票内容</div>
      <div class="item-pannel" v-if="invoice_content.length">

        <div class="item" v-for="(item , index) in invoice_content" :key="index">
          <div class="common-lt">
            {{ item.name }}
          </div>
          <div>
            <input type="radio" name="serverproject" @click.stop="invoiceCnt(item)">
          </div>
        </div>

      </div>
    </div>
    <div class="important-info">
      <div class="title">收票人信息</div>

      <div class="msg" v-if="is_paper==2">
        <div class="msg-left">电子邮箱：</div>
        <input type="text" placeholder="用于接受电子发票信息" class="rt" v-model="email">
      </div>
      <router-link to="/address" class="important" v-else>
        <div class="im-lt" v-if="defaultContract">
          <div class="name">
            <span class="people">{{ defaultContract.name }}</span>
            <span>{{ defaultContract.mobile }}</span></div>
          <div class="address"><span class="mo-icon">默认</span><span>{{ defaultContract.address }}</span></div>
        </div>
        <div class="arrow-rt"><span class="rt-icon"></span></div>
      </router-link>
    </div>


    <div class="apply-info" v-if="ticket_type==oringTicket_type">
      <div class="price">
        <span>开票金额：</span><span class="price-pre">¥</span><span class="price-num">{{ total_fee/100 | twoPointPre }}.</span><span class="price-next">{{ total_fee/100 | twoPointNext }}</span>
      </div>
      <div class="apply-btn" @click.stop="payBtn">提交</div>
    </div>
    <div class="paid-info" v-else>
      <div class="price">
        <div class="rate">
          <span>税费：</span><span class="price-pre">¥</span><span class="price-num">{{ (ticket_type==2 ? total_tax/100 : total_special_tax/100) | twoPointPre }}.</span><span class="price-next">{{ (ticket_type==2 ? total_tax/100 : total_special_tax/100) | twoPointNext }}</span>
        </div>
        <div class="rate-info">
          (开票金额：<span>¥{{ total_fee/100 | twoPoint }}</span>)

        </div>
      </div>
      <div class="pay-btn" @click.stop="payBtn">支付</div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showInvoiceInfo" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <div class="model">
          <p>开票金额不足10元，无法开票哦！</p>
          <p>请选择开收据</p>
          <div class="btn" @click.stop="showInvoiceInfo=false">知道了</div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { ButtonTab, ButtonTabItem ,XDialog ,Group, XAddress ,ChinaAddressV3Data , Value2nameFilter as value2name ,TransferDomDirective as TransferDom } from 'vux';
  import { twoPoint , twoPointNext ,twoPointPre } from 'src/filters/index';
  import { getDefaultAddress , postApplyInvoice ,bulidInvoiceOrder , getInvoiceInfo } from 'src/service/getData';
  import { WORLD_HTML_REG , TEL_REG ,MOBILE_REG ,EMAIL_REG , NUM_LET_REG } from 'src/config/data';
  import { mapState , mapActions , mapMutations } from 'vuex' ;
  import { getStorage , setSession } from 'src/config/tools';
export default {
  data () {
    return {
      invoiceType : [
        { id : 2 , text : '普通发票' , disabled : false },
        { id : 3 , text : '专用发票', disabled : false },
        { id : 1 , text : '收据', disabled : false }
      ], // 开票类型
      material : [
        { id : 2 , text : '电子发票' },
        { id : 1 , text : '纸质发票' }
      ],
      addressData: ChinaAddressV3Data,
      showInvoiceInfo : false ,
      showInfo : true ,
      order_items : [] ,
      oringTicket_type : this.$route.params.id , // 传值过来的开票类型
      ticket_type : 1 , // 默认为收据
      is_paper : 1 , // 发票材质
      company_region : [] , // 公司地址
      defaultContract : null , // 默认联系人信息
      title : '',
      tax_number : '',
      invoice_content_id : 0,
      company_address : '',
      company_mobile : '',
      bank : '',
      account : '',
      email: '',
      invoice_content : [], // 开票信息
      total_fee : 0 , // 开票的金额
      total_tax : 0 , // 开票的金额
      total_special_tax : 0 , // 开票的金额
    }
  },
  directives: {
    TransferDom
  },
  components : {
    vHead,XDialog,XAddress,Group
  },
  filters : {twoPoint , twoPointPre , twoPointNext },
  created(){
    this.order_items = this.$route.query.order_items || [] ;
    if(typeof this.order_items == 'string'){
      this.order_items = [+this.order_items] ;
    }
    this.$store.dispatch('refreshConfig') ;
    this.ticketTypeRule();
  },
  computed : {
    ...mapState(['config'])
  },
  methods : {
    ...mapActions(['refreshConfig']),
    ...mapMutations(['RECORD_PAYMENTMODEL']),
    ticketTypeRule(){

      // 选择某一个发票进来的
      if(this.oringTicket_type!=1){
        this.ticket_type = this.oringTicket_type ; // 赋值ticket_type
        for(let item of this.invoiceType){
          if(item.id != this.oringTicket_type){
            item.disabled = true ;
          }
        }
      }
    },
    getName (value) {
      return value2name(value, ChinaAddressV3Data)
    },
    ticketClick(item){
      if(!item.disabled){
        this.ticket_type = item.id ;
      }else{
        this.$vux.toast.text('无法选择其他发票类型' ,'middle');
      }
    },
    materialClick(item){
      this.is_paper = item.id ;
    },
    changeData(obj){
      let arr = [];
      for(let item of obj){
        let o = {};
        o.order_item_id = item ;
        o.ticket_type = this.ticket_type;
        arr.push(o);
      }
      return JSON.stringify(arr);
    },
    invoiceCnt( item ){
      this.invoice_content_id = item.invoice_content_id;
    },
    payBtn(){
      if(this.title){
        if(WORLD_HTML_REG.test(this.title)){
          this.$vux.toast.text('您输入的公司名称包含非法信息，请重新输入','middle');
          this.title = '' ;
          return false;
        }
      }else{
        this.$vux.toast.text('请填写公司名称','middle');
        return false;
      }
      if(this.tax_number){
        if(!NUM_LET_REG.test(this.tax_number)){
          this.$vux.toast.text('识别号只能为数字和字母，请重新输入','middle');
          this.tax_number = '' ;
          return false;
        }
      }else{
        this.$vux.toast.text('请填写识别号','middle');
        return false;
      }
      if(this.ticket_type==3){
        if(!this.getName(this.company_region)){
          this.$vux.toast.text('请选择公司地址','middle');
          return false;
        }
        if(this.company_address){
          if(WORLD_HTML_REG.test(this.company_address)){
            this.$vux.toast.text('您输入的详细地址包含非法信息，请重新输入','middle');
            this.company_address = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写详细地址','middle');
          return false;
        }
        if(this.company_mobile){
          if(!TEL_REG.test(this.company_mobile)){
            this.$vux.toast.text('您输入的公司电话是无效号码，请重新输入','middle');
            this.company_mobile = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写公司电话','middle');
          return false;
        }
        if(this.bank){
          if(WORLD_HTML_REG.test(this.bank)){
            this.$vux.toast.text('您输入的开户行包含非法信息，请重新输入','middle');
            this.bank = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写开户行信息','middle');
          return false;
        }

        if(this.account){
          if(WORLD_HTML_REG.test(this.account)){
            this.$vux.toast.text('您输入的开户账号包含非法信息，请重新输入','middle');
            this.account = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写开户账号','middle');
          return false;
        }
      }
      if(this.ticket_type==2&&this.is_paper==2){
        if(this.email){
          if(!EMAIL_REG.test(this.email)){
            this.$vux.toast.text('您输入的邮箱不符合要求，请重新输入','middle');
            this.email = '' ;
            return false;
          }
        }else{
          this.$vux.toast.text('请填写邮箱号码','middle');
          return false;
        }
      }
      if(!this.invoice_content_id){
        this.$vux.toast.text('请选择发票内容','middle');
        return false;
      }


      let params = {
        title : this.title ,
        invoice_content_id : this.invoice_content_id ,
        tax_number : this.tax_number
      };
      if(this.ticket_type == this.oringTicket_type){
        // 收据
        params.order_items = this.changeData(this.order_items);
        postApplyInvoice(params).then(res => {
          this.$router.replace('/invoice/paySuccess');
        }).catch( err => {
          this.$vux.toast.text(err.msg ,'middle');
        })
      }else {
        // 创建发票订单
        params.material = this.is_paper== 2 ? 0 : this.is_paper ;
        params.contact = this.defaultContract.name ;
        params.mobile = this.defaultContract.mobile ;
        params.address = this.defaultContract.address ;
        params.email = this.email ;
        params.ticket_type = this.ticket_type ;
        params.order_item_ids = JSON.stringify(this.order_items);
        if(this.ticket_type == 3){
          params.company_region = this.getName(this.company_region) ;
          params.company_address = this.company_address ;
          params.company_mobile = this.company_mobile ;
          params.bank = this.bank ;
          params.account = this.account ;
        }

        bulidInvoiceOrder(params).then(res => {
          let id = res.result.invoice_order_id;
          // 不支持对公打款
          // 跳转到选择支付方式页面
          let obj = {
            price : this.ticket_type == 3 ? this.total_special_tax/100 : this.total_tax/100 ,
            type : 'invoice' ,
            order_id : id
          };
          this.RECORD_PAYMENTMODEL(obj);
          setSession('paymentModel' ,obj );
          this.$router.replace('/payment');

        }).catch(err => {

          this.$vux.toast.show({
            text : err.msg ,
            type : 'warn'  ,
            width : '25%'
          });
        })
      }
    }
  },
  mounted(){
    getDefaultAddress().then( res => {
      this.defaultContract = res.result ;
    });
    let params = {
      field_order_item_ids : JSON.stringify(this.order_items)
    };

    getInvoiceInfo(params).then(res => {

      this.total_special_tax = res.result.total_special_tax;
      this.total_tax = res.result.total_tax;
      this.total_fee = res.result.total_fee;
      // 开票金额
      if( this.total_fee < 1000 ){
        this.showInvoiceInfo = true ;
        for(let item of this.invoiceType){
          if(item.id != 1){
            item.disabled = true ;
          }
        }
      }
    });
  },
  watch : {
    'config' : function(newVal , oldVal){
      this.invoice_content = newVal.invoice_content || getStorage('config').invoice_content ;
    }
  }
}

</script>
<style lang="scss">
  @import '../../style/mixin';
  .weui-cell{
    display: flex;
    width: 6.55rem;
    padding: 0 !important;
  }
  .weui-label > i {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.1rem;
    color: $red;
  }
  .vux-popup-picker-placeholder{
    font-size: 0.24rem !important;
  }
</style>
<style lang="scss" scoped>
  @import '../../style/mixin';
  .title{
    padding: 0 0.24rem;
    line-height: 0.9rem;
    border-bottom: 1px solid #e8e8e8;
    font-size: 0.3rem;
    color: #666;
  }
  .invoice-type{
    background-color: #fff;
    .type-box{
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0.46rem 0.2rem;
      .invoice-item{
        @include wh(2.06rem,0.68rem);
        line-height: 0.66rem;
        text-align: center;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        font-size: 0.28rem;
        color: $mainColor;
        &.active{
          border: 0 none;
          color: #fff;
          background-color: $mainColor;
        }
      }
    }
    .invoice-tips{
      padding: 0 0.46rem 0.3rem 0.46rem;
      font-size: 0.22rem;
      color: #999;
    }
  }
  .material {
    margin-top: 0.2rem;
    background-color: #fff;
    .material-type{
      display: flex;
      padding: 0.3rem 0.46rem;
      .material-item{
        @include wh(2.06rem,0.68rem);
        margin-right: 0.2rem;
        line-height: 0.66rem;
        text-align: center;
        border: 1px solid $mainColor;
        border-radius: 0.08rem;
        font-size: 0.28rem;
        color: $mainColor;
        &.active{
          border: 0 none;
          color: #fff;
          background-color: $mainColor;
        }
      }
    }
  }
  .invoice-head{
    margin-top: 0.2rem;
    background-color: #fff;
    .content{
      padding: 0 0.46rem;
      line-height: 0.9rem;
      .cnt-lt{
        @include sc(0.28rem,#1e1e1e);
        .require-icon{
          display: inline-block;
          vertical-align: middle;
          margin-left: 0.05rem;
          color: $red;
        }
      }
      input{
        @include wh(5rem,0.88rem);
        text-align: right;
        line-height: normal;
        font-size: 0.24rem;
        color: $fontColor;
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.9rem;
        border-bottom: 1px solid #e8e8e8;
        &:last-child{
          border-bottom:0 none;
        }
      }
    }
  }
  .invoice-content{
    margin-top: 0.2rem;
    background-color: #fff;
    .item-pannel{
      padding: 0 0.46rem 0.4rem;
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.4rem;
        .common-lt{
          font-size: 0.28rem;
          color: #1e1e1e;
        }
        input{
          position: relative;
          display: inline-block;
          @include wh(0.34rem,0.34rem);
          border-radius: 50%;
          border: 1px solid $mainColor;
          &:checked{
            &:before{
              content: '';
              position: absolute;
              top: 0.07rem;
              left: 0.07rem;
              @include wh(0.16rem,0.16rem);
              border-radius: 50%;
              background-color: $mainColor;
            }
          }
        }
      }
    }
  }
  .important-info{
    margin-top: 0.2rem;
    margin-bottom: 1rem;
    background-color: #fff;
    .msg{
      height: 0.9rem;
      line-height: 0.9rem;
      display: flex;
      justify-content: space-between;
      padding: 0 0.46rem;
      .msg-left{
        width: 1.7rem;
        @include sc(0.3rem,#1e1e1e);
      }
      .rt{
        width: 5rem;
        @include sc(0.26rem,$fontColor);
      }
    }
    .important{
      display: flex;
      justify-content: space-between;
      padding: 0.3rem 0.46rem;
      .im-lt{
        .name{
          @include sc(0.3rem,#1e1e1e);
        }
        .address{
          margin-top: 0.2rem;
          @include sc(0.24rem,#999);
          .mo-icon{
            height: 0.3rem;
            line-height: 0.3rem;
            padding: 0 0.06rem;
            margin-right: 0.2rem;
            border: 1px solid $red;
            border-radius: 0.04rem;
            @include sc(0.2rem,$red);
          }
        }
      }
      .arrow-rt{
        width: 0.44rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .rt-icon{
          display: inline-block;
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
  }
  .paid-info{
    position: fixed;
    bottom: 0;
    left: 0;
    @include wh(100%,1rem);
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #e8e8e8;
    .price{
      width: 5.1rem;
      padding: 0.18rem 0.3rem 0.2rem;
      text-align: right;
      background-color: #fff;
      .rate{
        @include sc(0.24rem,$fontColor);
        .price-pre{
          @include sc(0.22rem,$red);
        }
        .price-num{
          @include sc(0.3rem,$red);
        }
        .price-next{
          @include sc(0.24rem,$red);
        }
      }
      .rate-info{
        margin-top: 0.08rem;
        @include sc(0.2rem,#999);
      }
    }
    .pay-btn{
      width: 2.4rem;
      line-height: 1rem;
      @include sc(0.34rem,#fff);
      text-align: center;
      background-color: $mainColor;
    }
  }
  .model{
    width: 5.6rem;
    margin: 0 auto;
    padding: 0.58rem 0.35rem 0.4rem;
    border-radius: 0.24rem;
    background-color: #fff;
    p{
      @include sc(0.28rem,#1e1e1e);
      line-height: 0.44rem;
    }
    .btn{
      @include wh(2.18rem,0.64rem);
      line-height: 0.64rem;
      margin: 0.4rem auto 0;
      text-align: center;
      @include sc(0.28rem,#fff);
      border-radius: 0.08rem;
      background-color: $mainColor;
    }
  }
  .apply-info{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    @include wh(100%,1rem);
    border-top: 1px solid #e8e8e8;
    display: flex;
    line-height: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .price{
      width: 5.1rem;
      padding-right: 0.3rem;
      text-align: right;
      @include sc(0.24rem,$fontColor);
      .price-pre{
        @include sc(0.22rem,$red);
      }
      .price-num{
        @include sc(0.3rem,$red);
      }
      .price-next{
        @include sc(0.24rem,$red);
      }
    }
    .apply-btn{
      width: 2.4rem;
      @include sc(0.34rem,#fff);
      text-align: center;
      background-color: $mainColor;
    }

  }
</style>
