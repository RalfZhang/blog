---
title: 浅谈 Vue 父子组件中的通讯——父向子的值传递和事件触发 1/2
date: 2017-04-18 00:51:11
tags:
- Vue
---


谈起 Vue 父子组件中的通讯，一定会涉及到事件的触发和值的传递。本文尝试从**父组件向子组件**传值与触发事件谈一谈父子组件中的通讯问题。


![图片](./props-events.png)

----

## 1. 值的传递


在 Vue 中父组件向子组件传值非常简单，只要通过 `prop` 即可。
使用 `prop` 时主要解决两个问题：  
1. 父组件要给子组件传谁？
2. 子组件要接收谁？  

[请看此例](https://codepen.io/RalfZ/pen/EmPyKv)

### 父组件传出

第一个问题非常好解决，父组件只需要以 HTML 属性的形式把值绑定给子组件就行了，如下例：
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
  props: ['message1', 'message2', 'message3', 'messageFour'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message1” 这样使用
  template: '#child'
})
```
针对父组件传入的四个值，在此一一分析：
1. `this.message1` 接收到字符串 `'Hello!'`。
2. `this.message2` 接收到布尔类型 `true`。
3. `this.message3` 接收到父组件的 `value`，与父组件完全一致。
4. `this.messageFour` 接收到的是 `message-four` 传入的值，因为当使用的不是字符串模版，camelCased (驼峰式) 命名的 prop 需要转换为相对应的 kebab-case (短横线隔开式) 命名，这种类型在子组件接收时需要注意。  

----

## 2. 事件的触发  

正如文章开头的图片所示，在 Vue.js 中，父子组件的关系可以总结为 props down, events up。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。那么，我们如何做到父组件触发子组件的 events 呢？

### Hack 方法（不推荐）  

父组件将一个空对象通过 prop 传入子组件，子组件 watch 这个 prop。每次父组件给此属性重新复制新对象时候即可触发子组件的 watch。
这里有一个例子，点击父组件的按钮，子组件执行 add 的方法。

[请看此例](https://codepen.io/RalfZ/pen/KmVgxB)

### 正常方法（推荐）

比较推荐的做法是父组件通过在子组件放置 `ref='xxx'` 来标记子组件。
```HTML
<child ref='ch'></child>
```

通过 `this.$refs.xxx` 获取到子组件的实例，这里的实例相当于子组件内部的 `this`，这样就可以直接调用子组件内部的方法了。
```js
  methods: {
    update(){
      this.$refs.ch.add()
    }
  }
```


[请看此例](https://codepen.io/RalfZ/pen/NjxbWz)

我们明显可以看到，用这个方法比起 Hack 方法，代码量少了很多，逻辑也非常简单。

----

## 3. More  

对于稍微大的项目，[Vuex](https://vuex.vuejs.org/zh-cn/intro.html) 可能才是最好的选择方案。  
更多请看该系列下篇 [关于**子组件向父组件**的值传递和事件触发](/2017/04/19/vue-parent-child-communication-2)




## 参考  
https://cn.vuejs.org/v2/guide/components.html  
http://www.cnblogs.com/QRL909109/p/6166209.html