<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button type="primary" @click="addPrimss('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table :data="list" row-key="id" border>
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPrimss(row.id,2)">添加</el-button>
            <el-button type="text" @click="updatePermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="showDialog" @close="close">
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item label-width="120px" label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <el-form-item label-width="120px" label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>

        <el-form-item label-width="120px" label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>

        <el-form-item label-width="120px" label="是否开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="btnOk">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, updatePermission, getPermissionDetail } from '@/api/permisson'
import { transListToTreeNew2 } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      },
      rules: {
        name: [{ required: true, message: '不能为空' }],
        code: [{ required: true, message: '不能为空' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async updatePermission(id) {
      const res = await getPermissionDetail(id)
      this.formData = res
      this.showDialog = true
    },
    async delPermission(id) {
      await this.$confirm('确定删除？')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTreeNew2(res, '0')
    },
    addPrimss(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async btnOk() {
      await this.$refs.formRef.validate()
      try {
        if (this.formData.id) {
          // console.log('编辑')
          await updatePermission(this.formData)
          await this.getPermissionList()
          this.$message.success(`编辑权限成功`)
        } else {
          await addPermission(this.formData)
          await this.getPermissionList()
          this.$message.success(`新增权限成功`)
        }
        this.close()
      } catch (error) {
        console.log(error)
        this.$message.error(`${this.title}权限失败`)
      }
    },
    close() {
      this.showDialog = false
      this.$refs.formRef.resetFields()
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
    }
  }
}
</script>

<style>

</style>
