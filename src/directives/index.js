// 负责管理所有的自定义指令
export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom表示当前指令作用的对象
    // options 指令当中变量的解释 其中有一个属性叫做value
    // dom认为此时就是图片
    // 当前图片有地址 当时地址没有加载成功的时候 会报错 会触发图片的一个机制 => onerror
    dom.src = dom.src || options.value
    dom.onerror = function () {
      dom.src = options.value // 这里不能写死
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

export const test = {
  inserted(dom, options) {
    console.log(123123)
    dom.onerror = function () {
      dom.src = options.value // 这里不能写死
    }
  }
}
