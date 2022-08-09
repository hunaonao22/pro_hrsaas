<template>
  <div>
    <el-dialog title="编辑角色" :visible="isShowDialog" @close="close">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="btnOk">确定</el-button>
        <el-button>取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('修改成功')
      } catch (error) {
        console.log(error)
        this.$message.error('修改错误')
      }
      this.close()
    },
    close() {
      this.roleIds = []
      this.$emit('update:isShowDialog', false)
    },
    async getRoleList() {
      const res = await getRoleList()
      // console.log(res.rows)
      this.list = res.rows
    },
    async getUserDetailById(id) {
      const { roleIds = [] } = await getUserDetailById(id)
      console.log(roleIds)
      this.roleIds = roleIds
    }
  }
}
</script>

<style>

</style>
