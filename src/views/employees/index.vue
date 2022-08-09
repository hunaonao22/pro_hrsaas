<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button type="primary" size="mini" @click="$router.push('/import')">导入</el-button>
          <el-button type="danger" size="mini" @click="exportToExcel">导出</el-button>
          <el-button type="warning" size="mini" @click="isShowAddEmpDialog=true">新增员工</el-button>
        </template>
      </ToolBar>
      <el-table
        :data="list"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          type="index"
          label="序号"
          sortable
        />
        <el-table-column
          label="头像"
          sortable
        >
          <template v-slot="{row}">
            <el-avatar
              style="width:80px; height:80px;"
              :src="`${row.staffPhoto}`"
              @click.native="showQr(row.staffPhoto)"
            >
              <img style="width:80px; height:80px;border-radius:50%" :src="`${row.staffPhoto}`" alt="">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          sortable
        />
        <el-table-column
          prop="workNumber"
          label="工号"
          sortable
        />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          label="部门"
          sortable
        />
        <el-table-column
          prop="timeOfEntry"
          label="入职时间"
          sortable
        >
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="账户状态"
          sortable
        />
        <el-table-column
          fixed="right"
          label="操作"
          sortable
          width="280"
        >
          <template v-slot="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button :disabled="checkPermission('DELETE_USER')" type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="total"
          :current-page="page.page"
          :page-size="page.size"
          @current-change="currentChange"
        /></el-row>
    </div>
    <AddEmployee :is-show-add-emp-dialog.sync="isShowAddEmpDialog" />
    <el-dialog :visible.sync="isShow" title="二维码">
      <canvas ref="canvas" />
    </el-dialog>
    <AssignRole ref="roleRef" :current-id="currentId" :is-show-dialog.sync="isShowDialog" />
  </div>
</template>

<script>
// import ToolBar from '@/components/ToolBar'
import { getEmployeeList, delEmployee } from '@/api/employees'
import Employees from '@/assets/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/assets/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
import { mixins } from '@/utils/mixins'
export default {
  components: {
    // ToolBar
    AddEmployee,
    AssignRole
  },
  mixins: [mixins],
  data() {
    return {
      isShowDialog: false,
      isShow: false,
      tableData: [],
      currentId: '',
      list: [],
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      isShowAddEmpDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async editRole(id) {
      this.currentId = id
      await this.$refs.roleRef.getUserDetailById(id)
      this.isShowDialog = true
    },
    showQr(url) {
      this.isShow = true
      this.$nextTick(() => {
        console.log(this.$refs.canvas)
        QrCode.toCanvas(this.$refs.canvas, url)
      })
    },
    async exportToExcel() {
      // const tHeader = ['Id', '标题', '作者', '阅读', '时间']
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { export_json_to_excel } = await import(/* webpackChunkName:'exportToExcel'*/'@/utils/Export2Excel.js')
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      // console.log(rows)
      const resData = this.formatterData(rows, headers)
      console.log(resData)
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
    },
    currentChange(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    formatter(row, colnum, cellValue) {
      const currentData = Employees.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    async del(id) {
      try {
        await this.$confirm('确定删除？')
        await delEmployee(id)
        this.$message.success('删除成功')
        await this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    formatterData(rows, headers) {
      // console.log(rows)
      // console.log(headers)
      const res = rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return Employees.hireType.find(child => +child.id === +item[headers[key]]?.value || '未知')
          }
          return item[headers[key]]
        })
      })
      return res
    }
  }
}
</script>

<style>

</style>
