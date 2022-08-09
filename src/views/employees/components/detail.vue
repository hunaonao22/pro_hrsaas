<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账号设置">
        <el-form ref="formRef" :model="formData" :rules="rules">
          <el-form-item label-width="120px" label="姓名" prop="username">
            <el-input v-model="formData.username" style="width:40%" />
          </el-form-item>
          <el-form-item label-width="120px" label="密码" prop="password2">
            <el-input v-model="formData.password2" style="width:40%" />
          </el-form-item>
          <el-form-item label-width="120px">
            <el-button type="primary" @click="upadte">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="配置管理">
        <component :is="UserInfo" />
      </el-tab-pane>
      <el-tab-pane label="角色管理">
        <component :is="JobInfo" />
      </el-tab-pane>

    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // console.log(this.$route.params.id)
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      // console.log(res)
      this.formData = res
    },
    async upadte() {
      try {
        await this.$refs.formRef.validate()
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        // console.log(res)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
        this.$message.error('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  padding: 20px;
}
</style>
