<!--created by wanghan-->
<template>
  <div>
    <p class="title">
      用户管理
      <el-button type="primary" size="mini" @click="edit">新增</el-button>
    </p>
    <contentTable
      ref="table"
      :titles="titles"
      :constants="constants"
      :totalPage="totalPage"
      :pageParams="searchParam"
      :noOperat="false">
      <template slot="tdOperate" slot-scope="{item}">
        <!--<button type="button" class="btn btn-intab" @click="edit(item)">编辑</button>-->
        <button type="button" class="btn btn-intab" @click="del(item)">删除</button>
      </template>
    </contentTable>
    <el-dialog :visible.sync="showEditForm" :title="editData._id?'编辑':'新增'" width="470px" :close-on-click-modal="false">
      <edit-form
        v-if="showEditForm"
        :fields="editFields"
        :editData="editData"
        @save="save"
        label-width="120px"
        @close="showEditForm=false">
      </edit-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import {addUser, delUser, editUser, getUserList} from "../../api";
  import {Component,Vue} from "vue-property-decorator";
  import contentTable from "../common/contentTable.vue";
  import editForm from "../common/editForm.vue";
  import {FormFields, SearchFields, TableFields} from "../common/compFieldDefine";

  @Component({components: {contentTable, editForm}})
  export default class user extends Vue {
    tableLoading:boolean = false;
    showEditForm:boolean = false;
    totalPage:number=0;

    editData={_id:null};
    searchParam= {
      page: 1,
      pageSize: 15
    };
    fields:SearchFields={
      test:{type:'input',label:'hah'}
    };
    titles: TableFields = [
      {name: '用户名', value: 'name'},
      // {name:'类型',value:'type',options:[{label:'编内',value:'in'},{label:'编外',value:'out'}]},
      // {name:'有效期开始时间',value:'validFrom',timeFormat:'yyyy-MM-dd hh:mm:ss'},
      // {name:'有效期截止时间',value:'validTo',timeFormat:'yyyy-MM-dd hh:mm:ss'},
    ];
    editFields:FormFields= {
      name: {type: 'input', label: '用户名', required: true, editDisabled: true},
      // password:{type: 'password', label: '密码', required:true,editDisabled:true},
      // type:{type: 'select', label: '类型',value:'in',options:[{label:'编内',value:'in'},{label:'编外',value:'out'}], required:true},
    };
    get constants() {
      return this.$store.state.userList || []
    }

    created(){
      this.init();
    };
    init() {
      this.$store.dispatch('getUserList');
    }
    //打开新增、修改弹框
    edit(item:any) {
      this.editData = item;
      this.showEditForm = true;
    }
    //删除
    del(item) {
      this.$confirm('确定删除吗？', '提示').then(() => {
        delUser({_id: item._id}).then(res => {
          this.init();
          this.$message({type: 'success', message: '删除成功！'})
        }).catch(err => {
        });
      }).catch(() => {
      })
    }
    //保存
    save(val) {
      let params = {...val};
      params.type = 'in';
      let api = addUser;
      let Msg = '新增成功！';
      if (this.editData._id) {
        api = editUser;
        Msg = '修改成功！';
      }
      api(params).then(res => {
        this.init();
        this.showEditForm = false;
        this.$message({type: 'success', message: Msg})
      }).catch(err => {
      });
    }
  }

</script>

<style scoped>

</style>
