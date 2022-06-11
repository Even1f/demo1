<template>
  <div>
    <el-upload :http-request="upload" :before-upload="beforeUpload" :on-change="changeFile" :on-remove="handleRemove" list-type="picture-card" :limit="1" action="#" :on-preview="preview" :file-list="fileList" :class="{ disable: fileComputed }">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent"></el-progress>
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5'
const cos = new Cos({
  SecretId: 'AKIDb2EArISM2ScW9WdT4PUIWTAakeHekaAT',
  SecretKey: '4uTmpb7NM5YljRu74lCNHvJQHrBE0jDT'
})
export default {
  data() {
    return {
      showPercent: false,
      percent: 0,
      currentFileUid: null,
      fileList: [],
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      console.log(params)
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'broken-1258905589',
            Region: 'ap-beijing',
            Key: params.file.name,
            Body: params.file,
            StorageClass: 'STANDARD',
            onProgress: params => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            console.log(err || data)
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentFileUid) {
                  return { url: 'http://' + data.Location, upload: true }
                }
                return item
              })
              setTimeout(() => {
                this.showPercent = false
                this.percent = 0
              }, 1500)
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.disable .el-upload--picture-card {
  display: none;
}
</style>
