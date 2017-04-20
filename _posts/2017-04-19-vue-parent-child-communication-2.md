---
title: 浅谈 Vue 父子组件中的通讯——子向父的值传递和事件触发 1/2
date: 2017-04-19 23:24:08
tags:
- Vue
---

[上文](/2017/04/17/vue-parent-child-communication-1/)我们提到父组件向子组件的值传递和事件触发。本文我们谈谈**子组件向父组件**的值传递和事件触发。


![图片](./props-events.png)


如图片所示，在 Vue.js 中，父子组件的关系可以总结为 props down, events up。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。由于 Vue.js 单向数据流的设计理念，我们拒绝通过子组件直接修改父组件的值，因此，子组件向父组件的传值是需要伴随着触发事件一起发生的，而值作为事件的载荷，被传递给父组件。

## 1. 简单的事件触发  

首先，我们从最基础的事件触发开始做起。  

[请看实例](https://codepen.io/RalfZ/pen/EmPbeE)  

```html
  <child @update='add'></child>
```
父组件通过在子组件上 `@update='add'` 将父组件的 `add` 放到绑定/注册到 `update` 事件上。

```js
methods: {
  cadd(){
    this.$emit('update')
  }
}
```
子组件通过 `this.$emit('update')` 触发父组件绑定在 `update` 上的 `add`。

## 2. 父组件传参的事件触发

在父组件事件触发（调用）的同时，我们可以给父组件的方法传入父组件的参数。  

[请看实例](https://codepen.io/RalfZ/pen/JNXjxZ)  

相对于 1，这里的变化主要是 
```html
<child @update='add(step)'></child>
```
父组件的 `step` 作为参数传入到 `add` 方法中。  


## 3. 子组件传参的事件触发  

子组件触发父组件事件的同时，很多情况下是有传参需要的，这也是比较常用的子组件向父组件传值方式。

[请看实例](https://codepen.io/RalfZ/pen/xdVxNz)  

相对于 1，这里的主要变化是
```js
methods: {
  cadd(){
    this.$emit('update', this.step)
  }
}
```
要传递的值（载荷）作为 `$emit` 的第二个参数传入到父组件当中，父组件可以直接在 `methods` 里通过参数获取。

## 4. 子组件和父组件都需要传参的事件触发  

综合 2 和 3，我们可以发现，父组件的 `add` 方法传参已经被各自的方式占用
```js
methods: {
  add(num){ // 二者的 num 都有各自的用处
    this.value+= +num
  }
}
```
那么，如果我们父子组件都有传参进入，我们如何解决呢？

[请看实例](https://codepen.io/RalfZ/pen/JNXRbw)  

本例中，主要的逻辑在子组件上的 update 事件上这段里
```html
<child @update='function(cnum){ add(fstep, cnum) }'></child>
```
通过这种方式，保存父组件的 `fstep`，接收子组件的 `cnum`，再一起传入 `add` 函数中，实现了区分父子组件各自传值的区分。

## 5. 总结  
针对简单的传值问题，1 和 3 已经可以满足需求。  

2 中也可以采取在 `add` 函数中直接调用 `this.step` 的方式获取父组件的值。相似的，4 中也可以直接在 `add` 函数中调用 `this.fstep`获取值。  

不过，2 和 4 这种模式，可以应对子组件在 `v-for` 循环的情况，来保存 `v-for` 中不同的父组件的值。

## 更多  

正如上一篇中最后所提到的，对于稍微复杂的项目，[Vuex](https://vuex.vuejs.org/zh-cn/intro.html) 可能才是最好的选择方案。  
介于 Vuex 文档十分详细明了，在此就不画蛇添足了，以免弄巧成拙，误导了大家。