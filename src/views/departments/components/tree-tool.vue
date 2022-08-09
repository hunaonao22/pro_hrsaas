<template>
  <el-row style="width:100%" type="flex" justify="space-between">
    <el-col :span="12">{{ treeData.name }}</el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-around">
        <el-row :span="6">{{ treeData.manager }}</el-row>
        <el-row>
          <el-dropdown @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown></el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default() { return {} }
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickItem(type) {
      if (type === 'add') {
        console.log('add')
        this.$emit('handleAdd', this.treeData)
      } else if (type === 'edit') {
        console.log('edit')
        this.$emit('handleEdit', this.treeData)
      } else {
        await this.$confirm('确定删除？')
        // console.log('ok')
        await delDepartments(this.treeData.id)
        this.$emit('getDepartments')
        this.$message.success('删除成功')
      }
    }
  }
}
</script>

<style>

</style>
