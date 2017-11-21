<template lang="html">
  <div>

     <div class="date-pick">
      <div class="date-tit">
        <div class="pre" @click.stop="preMonth"></div>
        <div class="month"><span>{{ year }}</span>年<span>{{ month }}</span>月</div>
        <div class="next" @click.stop="nextMonth"></div>
      </div>
      <ul class="date-week">
        <li class="week-item">日</li>
        <li class="week-item">一</li>
        <li class="week-item">二</li>
        <li class="week-item">三</li>
        <li class="week-item">四</li>
        <li class="week-item">五</li>
        <li class="week-item">六</li>
      </ul>
      <div class="date-num">
        <div class="item" v-for="(item , index) in tempDateArr" :key="index"
        @click.stop="dateClick(item)"
        :class="{
        is_today : item.today ,
        is_selected : item.is_selected,
        is_disabled : item.is_disabled,
        is_start : item.timeStamp == selstart && norms > 2 && !item.is_null ,
        is_center : item.timeStamp > selstart && item.timeStamp < selend ,
        is_end : item.timeStamp == selend
        }"
        >
          <div class="date-box">
            <span class="date-day">{{ item.day }}</span>

            <span class="date-weather" :class="[ codeToClass(item.weather) ]"></span>

          </div>
          <div class="date-price" v-if="item.price && !item.is_disabled">¥<span>{{ item.price }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 删除数组某一项方法
  Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

export default {
  data () {
    return {
      tempDateArr : [] ,// 存放日期数组
      year : 2017, // 年份
      month : 1 , // 月份
      selstart :  0 , // 选择的开始日期的时间戳
      selend : 0, // 选择的结束日期的时间戳
      selectedDate : [] , // 选中的日期数组
    }
  },
  props : {
    norms : {
      default : 1 , // 时间规格默认给天（工作日）
      required : true
    },
    normsDays : {
      default : 1 , // 时间规格天数
      required : true
    },
    weather : {
      default : null ,
      required : true
    } ,
    mergeNorms : {
      default : false  // 针对 天(工作日)和天(周末) 都有的情况
    },
    activityStart : {
      default : ''   // 活动开始时间
    },
    activityEnd : {
      default : ''  // 活动结束时间
    },
    advanceDay : {
      default : 0 , // 提前预定天数
      required : true
    },
    price : {
      default : 0 , // 单价
      required : true
    },
    weekendPrice : {
      default : 0  // 周末价格
    }
  },
  created(){
    if( this.norms > 2 ){
      this.mergeNorms = false ;
    }
  },
  mounted(){
    this.year  = new Date().getFullYear() ;
    this.month = new Date().getMonth() + 1 ;
    this.initDate() ;
  },
  methods : {
    initDate(){
      this.tempDateArr = []; // 每次清空数组

      let today_d = new Date().getDate(); // 当日
      let today_m = new Date().getMonth() + 1; // 当月
      let today_y = new Date().getFullYear(); // 当年
      let todayTimestamp = new Date(today_y, today_m - 1, today_d).getTime(); // 当天时间戳
      let firstDay = new Date(this.year, this.month - 1, 1); // 本月第一天
      let weekDay = firstDay.getDay(); // 本月第一天星期几
      for (let i = 0; i < weekDay; i++) {
        this.tempDateArr.push({day: '', weather: '', price: '', is_disabled: true});
      }
      let y = firstDay.getFullYear();
      let m = firstDay.getMonth() + 1;
      let lastDate = new Date(y, m, 0);
      let ld = lastDate.getDate(); // 本月最后一天

      let candestineTimestamp = todayTimestamp;
      // 处理提前预定天数 可能为0
      if ( this.advanceDay || this.advanceDay == 0 ) {
        candestineTimestamp = todayTimestamp + ( this.advanceDay - 1 ) * 24 * 3600 * 1000;
      }
      for (let j = 1; j <= ld; j++) {
        // 不可预定的日期
        let tempTimestamp = new Date(this.year, this.month - 1, j).getTime();
        let week = new Date(this.year, this.month - 1, j).getDay();
        if (tempTimestamp <= candestineTimestamp) {
          let temp = {
            day: j, price: '', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
          };
          if (tempTimestamp == todayTimestamp) {
            temp.today = true;
            temp.day = '今天';
          }
          this.tempDateArr.push(temp);
        } else {
          // 可以预定的日期
          // 如果是活动
          if (this.norms == 1 && this.activityStart && this.activityEnd || this.norms == 2 && this.activityStart && this.activityEnd) {
            let startStamp = new Date(this.activityStart).getTime(); // 开始当天也算上
            let endStamp = new Date(this.activityEnd).getTime();
            if (tempTimestamp > endStamp || tempTimestamp < startStamp) {
              // 不在活动期间
              let temp = {
                day: j, price: '', is_selected: false, is_disabled: true, timeStamp: tempTimestamp
              };
              if (week == 0 || week == 6) {
                temp.is_week = true;
              }
              this.tempDateArr.push(temp);
            } else {
              // 在活动期间
              let temp = {day: j, price: this.price, is_selected: false, timeStamp: tempTimestamp};
              if (week == 0 || week == 6) {
                temp.is_week = true;
              }
              this.tempDateArr.push(temp);
            }
          } else {
            // 不为活动的处理
            let temp = {day: j, price: this.price, is_selected: false, timeStamp: tempTimestamp};
            if (week == 0 || week == 6) {
              temp.is_week = true;
            }
            this.tempDateArr.push(temp);
          }
        }
      }

      if (this.mergeNorms) {
        // 针对既有工作日又有周末的规格的合并处理
        // 如果周中和周末价格不同的话，处理逻辑
        if (this.weekendPrice && this.weekendPrice != this.price) {
          for (let k of this.tempDateArr) {
            if (k.is_week) {
              k.price = this.weekendPrice;
            }
          }
        }
      } else {
        // 分开处理周末和周中
        if (this.norms == 1) { // 工作日
          for (let k of this.tempDateArr) {
            if (k.is_week) {
              k.is_disabled = true;
            }
          }
        }
        if (this.norms == 2) { // 周末
          for (let k of this.tempDateArr) {
            if (!k.is_week) {
              k.is_disabled = true;
            }
          }
        }
      }
      if (this.weather) {
        for (let w in this.weather) {
          for (let k of this.tempDateArr) {
            let date = this.formatDate(k.timeStamp);
            if (w == date) {
              k.weather = this.weather[w];
            }
          }
        }

      }
      // 已选 渲染
      if (this.selectedDate.length) {
        for (let t of this.selectedDate) {
          for (let k of this.tempDateArr) {
            let date = this.formatDate(k.timeStamp);
            if (date == t) {
              k.is_selected = true;
            }
          }
        }
      }
    },
    nextMonth(){
      this.month++;
      if (this.month > 12) {
        this.month = 1;
        this.year++;
      }
      this.initDate();
    },
    preMonth(){
      this.month--;
      if (this.month < 1) {
        this.month = 12;
        this.year--;
      }
      this.initDate();
    },
    formatDate(timestamp){
      let y = new Date(timestamp).getFullYear();
      let m = new Date(timestamp).getMonth() + 1;
      let d = new Date(timestamp).getDate();
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
      let date = y + '-' + m + '-' + d;
      return date;
    },
    normRuler(){
      //3 周7  4 月30   5 年365  6 半月15   7 半年180  8 三个月90

      if (this.norms == 1 || this.norms == 2) {
        // 保存已选的数据
        this.saveday();
      } else {
        let startTime = this.selstart;
        let endTime = this.selstart + this.normsDays * 24 * 3600 * 1000;
        this.selend = endTime - 24 * 3600 * 1000;
        // 选中状态
        for (let k of this.tempDateArr) {
          if (k.timeStamp >= startTime && k.timeStamp < endTime) {
            k.is_selected = true;
          } else {
            k.is_selected = false;
          }
        }
        // 先清空选中数组
        this.selectedDate = [];
        // 有开始时间才保存
        if (this.selstart) {
          for (let i = 0; i < this.normsDays; i++) {
            let time = this.selstart + i * 24 * 3600 * 1000;
            let date = this.formatDate(time);
            this.selectedDate.push(date);
          }
        }
        console.log(this.selectedDate);
      }
    },
    dateClick(item){
      // 如果禁止了不做任何处理
      if (item.is_disabled) {
        return;
      }
      item.is_selected = !item.is_selected;
      this.selstart = item.timeStamp;
      this.normRuler();
      // 触发父级的监听事件

      this.$emit('pipeData', this.selectedDate)
    },
    saveday(){
      for (let val of this.tempDateArr) {
        let date = this.formatDate(val.timeStamp);
        if (val.is_selected) {
          this.selectedDate.push(date);
        } else {
          // 去除没选中但是日期会出现在选择数组中的情况
          this.selectedDate.remove(date);
        }
      }
      // 去重
      this.selectedDate = [...new Set(this.selectedDate)];

      console.log(this.selectedDate);
    },
    codeToClass (code){
      if (!code) {
        return '';
      }
      if (code == 100 || code == 201) {
        return 'sun'
      }
      if (code == 101 || code == 102 || code == 103 || code == 104) {
        return 'cloudy'
      }
      if (code == 300 || code == 301 || code == 303 || code == 304) {
        return 'showerRain'
      }
      if (code == 305 || code == 309) {
        return 'lightRain'
      }
      if (code == 306) {
        return 'moderateRain'
      }
      if (code >= 307 && code <= 313 && code != 309) {
        return 'heavyRain'
      }
      if (code >= 400 && code <= 407) {
        return 'snow'
      }
      if (code >= 500 && code <= 402) {
        return 'foggy'
      }
      if (code >= 200 && code <= 213 && code != 201) {
        return 'wind'
      }
      if (code >= 503 && code <= 508) {
        return 'sand'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/mixin' ;
  .date-pick{
    padding: 0.2rem 0;
    background-color: #fff;
    .date-tit{
      padding: 0 0.25rem;
      height: 1.08rem;
      line-height: 1.08rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .pre{
        display: inline-block;
        @include wh( 0.48rem, 0.48rem );
        @include bg-image( '../images/ic_back_black');
      }
      .next{
        display: inline-block;
        @include wh( 0.48rem, 0.48rem );
        @include bg-image( '../images/ic_next');
      }
      .month{
        font-size: 0.36rem;
      }
    }
    .date-week{
      height: 0.52rem;
      line-height: 0.52rem;
      display: flex;
      padding: 0 0.24rem;
      background-color: #F6F6FB;
      .week-item{
        width: 1rem;
        text-align: center;
        font-size: 0.24rem;
        color: #999;
      }
    }
    .date-num{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 0.24rem;
      .item{
        @include wh(1rem ,1rem);
        &.is_today {
          .date-box{
            .date-day{
              font-size: 0.24rem;
              color: $mainColor !important;
            }
          }

        }
        &.is_selected{
          .date-box{
            .date-day{
              display: inline-block;
              @include wh( 0.44rem , 0.44rem );
              border-radius: 50%;
              color: #fff;
              background-color: $mainColor;
              overflow: hidden;
            }
          }
        }
        &.is_disabled{
          .date-box{
            .date-day{
              color:  #D2D2D2;
            }
          }
        }
        &.is_start {
          .date-box{
            border-radius: 0.22rem 0 0 0.22rem;
            background-color: $mainColor;
          }
        }
        &.is_center {
          .date-box{
            background-color: $mainColor;
          }
        }
        &.is_end {
          .date-box{
            border-radius:0 0.22rem 0.22rem 0;
            background-color: $mainColor;
          }
        }
        .date-box{
          position: relative;
          top: 0;
          left: 0;
          height: 0.44rem;
          line-height: 0.44rem;
          text-align: center;
          .date-day{
            font-size: 0.3rem;
            color: #666;
          }
          .date-weather{
            position: absolute;
            top: 0;
            right: 0;
            @include wh( 0.26rem , 0.26rem );
            &.sun{
              @include bg-image('../images/weather/ic_sun_three');
            }
            &.cloudy{
              @include bg-image('../images/weather/ic_cloudy_three');
            }
            &.showerRain{
              @include bg-image('../images/weather/ic_shower Rain_three');
            }
            &.lightRain{
              @include bg-image('../images/weather/ic_light rain_three');
            }
            &.moderateRain{
              @include bg-image('../images/weather/ic_moderate rain_three');
            }
            &.heavyRain{
              @include bg-image('../images/weather/ic_heavy Rain_three');
            }
            &.snow{
              @include bg-image('../images/weather/ic_snow_three');
            }
            &.foggy{
              @include bg-image('../images/weather/ic_foggy_three');
            }
            &.wind{
              @include bg-image('../images/weather/ic_wind_three');
            }
            &.sand{
              @include bg-image('../images/weather/ic_sand_three');
            }
          }
        }
        .date-price{
          margin-top: 0.1rem;
          text-align: center;
          font-size: 0.18rem;
          color: #999;
        }
      }
    }
  }
</style>
