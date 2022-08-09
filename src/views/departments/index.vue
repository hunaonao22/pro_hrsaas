<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool :is-root="true" :tree-data="company" @handleAdd="handleAdd" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data" @handleEdit="handleEdit" @handleAdd="handleAdd" @getDepartments="getDepartments" />
        </template>
      </el-tree>
      <AddDept ref="addDept" :current-node="currentNode" :is-show-add-dept.sync="isShowAddDept" />
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tool.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      loading: false,
      currentNode: '',
      isShowAddDept: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 添加部门
    handleAdd(node) {
      this.isShowAddDept = true
      // console.log(123)
      this.currentNode = node
    },
    // 编辑部门
    handleEdit(node) {
      this.isShowAddDept = true
      this.currentNode = node
      this.$refs.addDept.getDetailByid(node.id)
    },
    // 请求数据
    async getDepartments() {
      try {
        this.loading = true
        const res = await getDepartments()
        console.log(res)
        this.company = {
          name: res.companyName,
          manager: res.companyManage || '管理员',
          id: ''
        }
        // this.departs = transListToTree(res.depts, '')
        this.departs = transListToTreeNew(res.depts)
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
  width: 850px;
  border: 1px solid red;
  margin: 100px auto;
}
.tempRow{
  width: 100%;
}
</style>
