export interface ListModel {
  pageNum: number //pageNum 不可小于 0
  pageSize: number //pageSize 不可小于 0
  sort: number //'排序规则: 1.正序/2.倒序'
}
