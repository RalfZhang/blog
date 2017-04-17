---
title: 浅谈 Vue 父子组件中的通讯————父向子的值传递和事件触发 1/2
date: 2017-04-18 00:51:11
tags:
- Vue
---


谈起 Vue 父子组件中的通讯，一定会涉及到事件的触发和值的传递。本文尝试从父组件向子组件传值与触发事件谈一谈父子组件中的通讯问题。

## 值的传递

![图片](./props-events.png)

在 Vue 中父组件向子组件传值非常简单，只要通过 `prop` 即可。
使用 `prop` 时主要解决两个问题：  
1. 父组件要给子组件传谁？
2. 子组件要接收谁？  

### 父组件传出

第一个问题非常好解决，父组件只需要以 `attr` 的形式把值绑定给子组件就行了，如下例：
```js
<child message1='Hello!' :message2='true' :message3='value' message-four='World!'></child>
```
这里举出了四种传值方式：  
1. 直接传递字符串 `'Hello!'`。
2. 传递原始数据类型布尔类型 `true`。当然，也可以传递数字类型。
3. 通过键名传递绑定在父组件的属性值。这个传志就非常灵活了，可以传递任意类型数据。
4. kabab-case传递字符串，这种类型在子组件接收时需要注意。

### 子组件传入

第二个问题来了：子组件如何接收传来的这么多数据？  
针对上一节传入的四个值，子组件只需要显式地用 `props` 选项声明它期待获得的数据：
```js
Vue.component('child', {
  // 声明 props
  props: ['message1', 'message2', 'message3', 'messageFour'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message1” 这样使用
  template: '<div><span>{{ message1 }}</span>,  <span v-if="message2">YES 2!</span><span v-else></span><span>{{ message3 }}</span><span>{{ messageFour }}</span></div>'
})
```
针对父组件传入的四个值，在此一一分析：
1. this.message1 接收到字符串 `'Hello!'`。
2. this.message2 接收到布尔类型 `true`。
3. this.message3 接收到父组件的 `value`，与父组件完全一致。（甚至于你可以直接修改这个 `value` 来影响父组件，但**非常不推荐**这么做）
4. this.messageFour 接收到的是 `message-four` 传入的值，因为当使用的不是字符串模版，camelCased (驼峰式) 命名的 prop 需要转换为相对应的 kebab-case (短横线隔开式) 命名，这种类型在子组件接收时需要注意。