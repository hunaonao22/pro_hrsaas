<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-button icon="el-icon-plus" size="small" type="primary" @click="isShowDialog=true">新增角色</el-button>
            <el-table
              :data="list"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="角色名称"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column
                label="操作"
              >
                <template slot-scope="{row}">
                  <el-button type="success" size="small" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="edit(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="del(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="margin-top:10px" type="flex" justify="center">
              <el-pagination
                :page-size="page.pagesize"
                :current-page="page.page"
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="currentChange"
              /></el-row>
          </el-tab-pane>
          <el-tab-pane label="公司管理" name="second">
            <el-alert
              show-icon
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
            />
            <el-form disabled label-width="120px" style="margin-top:20px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width:50%" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:50%" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width:50%" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" style="width:50%" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </el-card>

      <el-dialog
        :title="`${roleFormData.id ?'编辑':'新增'}角色`"
        :visible="isShowDialog"
        @close="close"
      >
        <el-form ref="roleFormData" :model="roleFormData" :rules="roleRules" label-width="120px">
          <el-form-item label="角色" prop="name">
            <el-input v-model="roleFormData.name" style="width:50%" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="roleFormData.description" style="width:50%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="btnOk">确定</el-button>
        </template>
      </el-dialog>

      <el-dialog title="分配权限" :visible="showPermissionDialog" @close="closePremission">
        <el-tree
          ref="treeRef"
          :data="premissinoList"
          :props="props"
          node-key="id"
          show-checkbox
          default-expand-all
          check-strictly
          :default-checked-keys="checkedKeys"
        />
        <template #footer>
          <el-button size="mini" @click="closePremission">取消</el-button>
          <el-button size="mini" type="primary" @click="btnOkPremission">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTreeNew2 } from '@/utils/index'
export default {
  data() {
    return {
      showPermissionDialog: false,
      roleFormData: {
        name: '',
        description: ''
      },
      premissinoList: [],
      checkedKeys: [],
      currentId: null,
      props: {
        label: 'name'
      },
      roleRules: {
        name: [{
          required: true,
          message: '角色必填'
        }]
      },
      isShowDialog: false,
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 2
      },
      list: [],
      total: 0,
      formData: {}
    }
  },
  created() {
    this.getRoleList(this.page)
    this.getCompanyInfo()
  },
  methods: {
    async btnOkPremission() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      await assignPerm({
        id: this.currentId,
        permIds: checkedKeys
      })
      this.$message.success('修改成功')
      this.closePremission()
    },
    closePremission() {
      this.checkedKeys = []
      this.showPermissionDialog = false
    },
    async assignPerm(id) {
      this.currentId = id
      this.showPermissionDialog = true
      this.premissinoList = transListToTreeNew2(await getPermissionList(), '0')

      // this.checkedKeys = []
      const { permIds } = await getRoleDetail(id)
      this.checkedKeys = permIds
    },
    // 获取数据
    async  getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.total = total
      // console.log(rows)
    },
    currentChange(page) {
      this.page.page = page
      console.log(page)
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
      // console.log(this.formData)
    },
    async del(row) {
      // console.log(row)
      await this.$confirm('确定删除？')
      const len = this.list.length
      await deleteRole(row.id)
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除成功')
      await this.getRoleList()
    },
    async edit(id) {
      this.roleFormData = await getRoleDetail(id)
      this.isShowDialog = true
    },
    close() {
      this.isShowDialog = false
      this.$refs.roleFormData.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async btnOk() {
      await this.$refs.roleFormData.validate()
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.getRoleList()
      this.$message.success('修改成功')
      this.close()
    }
  }
}
</script>

<style>

</style>
