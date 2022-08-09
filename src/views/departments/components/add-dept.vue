<template>
  <div>
    <el-dialog :visible="isShowAddDept" :title="`${showTitle}部门`" @close="close">
      <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="formData.manager" /> -->
          <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: [Object, String],
      default: null
    }
  },
  data() {
    const checkName = async(rule, value) => {
      const { depts } = await getDepartments()
      let currentChildren = null
      if (this.formData.id) {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }
      const isRepeat = currentChildren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复')
      }
    }
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments()
      console.log(depts)
      let isRepeat = null
      if (this.formData.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      if (isRepeat) {
        return Promise.reject('部门编码重复')
      }
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      options: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '添加'
    }
  },
  methods: {
    // 获取员工
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    // 提交
    async submit() {
      // 编辑
      if (this.formData.id) {
        await this.$refs.form.validate()
        await updateDepartments(this.formData)
      } else {
        // 添加
        await this.$refs.form.validate()
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}成功`)
      this.close()
    },
    // 关闭
    close() {
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:isShowAddDept', false)
    },
    // 获取详细信息
    async getDetailByid(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
