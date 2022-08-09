<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list.sync="fileList"
      :on-change="changeFile"
      :http-request="upload"
      :class="{completed :isCompleted}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-progress v-if="isShow" style="width:200px" :percentage="percentage" />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDGJ6crpWw5h7HBoDOJyOaWCcniOozvb1B',
  SecretKey: 'xe5GDuKTMzTpwnOjodBTIuGLAl58uQgg'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      isShow: false,
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        { url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2022%252F0725%252F1f865749j00rfkkys0034d000u000u0p.jpg%26thumbnail%3D660x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273838&t=08c88925f1c587b2271f3f752b3e279b' }
      ]
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    upload({ file }) {
      console.log(file)
      cos.putObject({
        Bucket: 'web-1313213605', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        if (err) {
          return this.$message.error(err?.message || '上传出错')
        }
        this.fileList.filter(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })
      })
      setTimeout(() => {
        this.isShow = false
        this.percentage = 0
      }, 2000)
    },
    changeFile(file, fileList) {
      // this.fileList.push(file)
      this.fileList = fileList
      this.isShow = true
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型不正确')
        return false
      }
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error('文件过大')
        return false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.completed{
  ::v-deep .el-upload--picture-card{
   display: none;
 }
}
</style>
