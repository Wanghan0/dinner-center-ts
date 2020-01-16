<template>
  <div class="table_wrap">
    <table class="table">
      <tr>
        <th v-if="checkKey || checkItem"><input type="checkbox" v-model="isCheckall" @change="checkAll"></th>
        <th v-if="showIndex">序号</th>
        <th :width="item.width?item.width:''" v-for="item in titles">{{item.name}}</th>
        <th :width="operateWidth" v-if="!noOperat">操作</th>
      </tr>
      <tr v-for="(item,index) in constants" :key="index">
        <td v-if="checkKey"><input type="checkbox" v-model="checkArrays" :value="item[checkKey]"></td>
        <td v-else-if="checkItem"><input type="checkbox" v-model="checkArrays" :value="item"></td>
        <td v-if="showIndex">{{pageParams.pageSize*(pageParams.page-1)+index+1}}</td>
        <td v-for="one in titles" :title="one.strCut?item[one.value]:''">
          <template v-if="one.customTd">
            <slot name="tdCustom" :item="item" :one="one" :index="index"></slot>
          </template>
          <template v-else>
            {{showWords(item[one.value],one)}}
          </template>
        </td>
        <td v-if="!noOperat">
          <slot name="tdOperate" :item="item"></slot>
        </td>
      </tr>
      <tr v-if="constants.length===0">
        <td :colspan="1000">暂无内容</td>
      </tr>
      <tr v-if="addPageNumber && pageCount<totalPage && constants.length>0">
        <td :colspan="1000">
          <button class="btn btn-intab" @click="more">加载更多</button>
        </td>
      </tr>
    </table>
    <page v-if="totalPage>1 && !addPageNumber" :total-page="totalPage" v-on:goPage="nextPage"
          v-on:changePageSize="changePageSize"></page>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator"
  import page from "./page.vue"
  import {TableField, TableFields} from './compFieldDefine'

  @Component({components: {page}})
  export default class contentTable extends Vue {
    @Prop() constants: any[]
    @Prop() titles: TableFields
    @Prop() totalPage: number
    @Prop() pageParams: any
    @Prop({default: false}) noOperat?: boolean
    @Prop() checkKey?: string
    @Prop({default: false}) showIndex?: boolean
    @Prop() operateWidth?: string
    @Prop({default: false}) checkItem?: boolean
    @Prop() addPageNumber?: number

    isCheckall: boolean = false
    pageCount: number = 1
    checkArrays: any = []

    @Watch('checkArrays')
    checkArraysChange (val: any[]) {
      if (val.length === this.constants.length && this.constants.length !== 0) {
        this.isCheckall = true
      } else {
        this.isCheckall = false
      }
      this.$emit('checkArrays', val)
    }

    @Watch('constants')
    constantsChange () {
      if (this.checkKey) {
        this.checkArrays = []
      }
    }

    @Watch('addPageNumber')
    addPageNumberChange (val: number) {
      this.pageCount = val
    }

    /**
     * @author wanghan
     * @date 2019/8/5
     * @Description: 表格内容转换展示
     */
    showWords (value: any, one: TableField): any {
      if (value === null || value === '') {
        return '-'
      }
      let result: string = '-'
      if (one.func) {                 //支持自定义函数转换，例{name:'事件类型',value:'eventType',func:this.test},methods:test(val){if(val==='001001'){return 'whtest';}else {return '-'}},
        return one.func(value)
      } else if (one.options) {        //支持给定{label:'',value:''}对应转换，例{name:'事件类型',value:'eventType',options:[{label:'showWords',value:'001001'}]}
        let obj = one.options.find((item: any) => {
          return item.value === value
        })
        result = obj ? obj.label : value
      } else if (one.timeFormat) {      //支持时间戳转换，例{name:'更新时间',value:'outime',timeFormat:'yyyy-MM-dd hh:mm:ss'},
        result = new Date(value).format(one.timeFormat)
      } else if (one.strCut) {          //支持文字超出隐藏鼠标悬浮展示，例{name:'左边条件表达式',value:'leftExpression',strCut:80},
        result = this.strCut(one.strCut, value) || '-'
      } else {
        result = value
      }
      return result
    }

    nextPage (jumpPage: any) {
      this.$emit('goPage', jumpPage)
    }

    changePageSize (pageSize: number) {
      this.$emit('changePageSize', pageSize)
    }

    more () {
      this.pageCount++
      this.$emit('addPage', this.pageCount)
    }

    checkAll () {
      this.checkArrays.length = 0
      if (this.isCheckall) {
        this.constants.forEach((item: any, index: number) => {
          if (this.checkItem) {
            this.checkArrays.push(item)
          } else if (this.checkKey) {
            this.checkArrays.push(item[this.checkKey])
          }
        })
      }
    }

    //文字超出隐藏
    strCut (num: number, str: string): string {
      if (!num || !str) {
        return '-'
      } else {
        if (str.split("").length < num) {
          return str.slice(0, num)
        } else {
          return str.slice(0, num) + '...'
        }
      }
    }
  }
</script>
<style scoped>
  .table_wrap {
    background: #fff;
    margin-top: 20px;
  }

  table tr td {
    word-break: break-all;
  }
</style>
