import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除组织架构的部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    method: 'post',
    data,
    url: '/company/department'
  })
}

// 获取某个部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`

  })
}

// 保存编辑的数据
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
