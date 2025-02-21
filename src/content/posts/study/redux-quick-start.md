---
title: Redux 快速入门指南

published: 2025-02-21 00:14:00

description: Redux 快速入门

tags: [Markdown, Blogging, React]

category: React

draft: false

---



# Redux 快速入门指南

**作者**: Turnip1202  
**发布时间**: 2025-02-21  

## 目录

1. [什么是Redux](#什么是redux)
2. [Redux核心概念](#redux核心概念)
3. [基本工作流程](#基本工作流程)
4. [实战示例](#实战示例)
5. [Redux工具包（Redux Toolkit）](#redux工具包)

## 什么是Redux

Redux是JavaScript应用的状态容器，提供可预测的状态管理。虽然通常与React一起使用，但它也可以与任何其他JavaScript框架一起使用。Redux适用于以下场景：

- 应用中有大量的状态需要管理
- 状态频繁更新
- 更新逻辑较为复杂
- 多个组件需要共享状态
- 中大型应用需要可预测的状态管理

## Redux核心概念

### 1. Store

Store是存储应用状态的地方，每个Redux应用只有一个store。

### 2. Action

Action是一个描述发生了什么的普通JavaScript对象，必须包含一个`type`属性。

### 3. Reducer

Reducer是一个纯函数，接收当前状态和action，返回新的状态。

## 基本工作流程

Redux的工作流程是单向的：

1. 用户触发事件
2. 派发（dispatch）一个action
3. reducer处理action并返回新状态
4. store更新状态
5. 视图重新渲染

## 实战示例

让我们通过一个简单的计数器示例来了解Redux：

* 详细理解Redux的概念：
  
  * actionCreators->需要返回一个对象
    
    * 动作的对象
    
    * 包含2个属性  
      type：标识属性, 值为字符串, 唯一, 必要属性  
      data：数据属性, 值类型任意, 可选属性
    
    ```ts
    type actionType = (payload: any) => { type: String, payload: any }
    const actionCreators: actionType = (payload) => ({ type: 'test', payload })
    ```
  
  * reducer->加工厂
    
    * 用于初始化状态、加工状态。
    
    * 加工时，根据旧的state和action， 产生新的state的纯函数。
  
  * store->将state、action、reducer联系在一起的对象
  
  * 使用store.dispatch(actionCreators(payload))进行状态的修改
    
    * 这里注意，actionCreators会返回一个{ type: String, payload: any }的对象，
    
    * 所以在reducer内部会根据type进行dispatch，因此，不必担心重名派发(dispatch)，
    
    * 只有你将多个actionCreators的type写成相同的时候，才会出现重名派发(dispatch)

* stroe/counter/actionCreators.js
  
  ```js
  import * as actionTypes from "./constants"
  
  export const addNumberAction = (num) => ({
    type: actionTypes.ADD_NUMBER,
    num
  })
  
  export const subNumberAction = (num) => ({
    type: actionTypes.SUB_NUMBER,
    num
  })
  
  ```

* stroe/counter/constant.js
  
  ```js
  export const ADD_NUMBER = "add_number"
  export const SUB_NUMBER = "sub_number"
  
  ```

* stroe/counter/index.js
  
  ```js
  import reducer from "./reducer"
  
  export default reducer
  export * from "./actionCreators"
  
  ```

* stroe/counter/reducer.js
  
  ```js
  import * as actionTypes from "./constants"
  
  const initialState = {
    counter: 200
  }
  
  function reducer(state = initialState, action) {
    console.log("reducer-action", action)
  
    switch (action.type) {
      case actionTypes.ADD_NUMBER:
        return { ...state, counter: state.counter + action.num }
      case actionTypes.SUB_NUMBER:
        return { ...state, counter: state.counter - action.num }
      default:
        return state
    }
  }
  
  export default reducer
  
  ```

* stroe/index.js
  
  ```js
  import { legacy_createStore as createStore, compose, combineReducers } from "redux"
  import { log, thunk, applyMiddleware } from "./middleware"
  // import thunk from "redux-thunk"
  
  import counterReducer from "./counter"
  import homeReducer from "./home"
  import userReducer from "./user"
  
  // 正常情况下 store.dispatch(object)
  // 想要派发函数 store.dispatch(function)
  
  // 将两个reducer合并在一起
  const reducer = combineReducers({
    counter: counterReducer,
    home: homeReducer,
    user: userReducer
  })
  
  // combineReducers实现原理(了解)
  // function reducer(state = {}, action) {
  //   // 返回一个对象, store的state
  //   return {
  //     counter: counterReducer(state.counter, action),
  //     home: homeReducer(state.home, action),
  //     user: userReducer(state.user, action)
  //   }
  // }
  
  // redux-devtools
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true }) || compose;
  const store = createStore(reducer)
  
  applyMiddleware(store, log, thunk)
  
  export default store
  ```

* 使用page/home.jsx
  
  ```js
  import React, { PureComponent } from 'react'
  import store from "../store"
  import { addNumberAction } from '../store/counter'
  
  export class Home extends PureComponent {
    constructor() {
      super()
  
      this.state = {
        counter: store.getState().counter.counter,
  
        message: "Hello World",
        friends: [
          {id: 111, name: "why"},
          {id: 112, name: "kobe"},
          {id: 113, name: "james"},
        ]
      }
    }
  
    componentDidMount() {
      store.subscribe(() => {
        const state = store.getState().counter
        this.setState({ counter: state.counter })
      })
    }
  
    addNumber(num) {
      store.dispatch(addNumberAction(num))
    }
  
    render() {
      const { counter } = this.state
  
      return (
        <div>
          <h2>Home Counter: {counter}</h2>
          <div>
            <button onClick={e => this.addNumber(1)}>+1</button>
            <button onClick={e => this.addNumber(5)}>+5</button>
            <button onClick={e => this.addNumber(8)}>+8</button>
          </div>
        </div>
      )
    }
  }
  
  export default Home
  ```

## Redux工具包（Redux Toolkit）

Redux Toolkit是官方推荐的编写Redux逻辑的方式。它能够简化很多Redux的样板代码：

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0
    },
    reducers: {
        increment: state => {
            state.count += 1;
        },
        decrement: state => {
            state.count -= 1;
        }
    }
});

// 导出action creators
export const { increment, decrement } = counterSlice.actions;

// 创建store
const store = configureStore({
    reducer: counterSlice.reducer
});

export default store;
```

## 在React中使用Redux

使用React-Redux库将Redux与React结合：

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
    const count = useSelector(state => state.count);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
        </div>
    );
}

export default Counter;
```

## 最佳实践

1. **保持状态最小化**：只存储必要的数据
2. **使用不可变更新模式**：不直接修改状态，而是返回新对象
3. **规范Action类型**：使用具有意义的字符串常量
4. **使用Redux Toolkit**：简化开发流程，减少样板代码
5. **合理划分Reducer**：按照功能模块拆分

## 结论

Redux虽然有一定的学习曲线，但它提供了可预测的状态管理方案，特别适合中大型应用。通过本文的介绍，你应该已经掌握了Redux的基本概念和使用方法。建议从小项目开始实践，逐步深入学习Redux的高级特性。

## 扩展阅读

- [Redux官方文档](https://redux.js.org/)
- [Redux Toolkit文档](https://redux-toolkit.js.org/)
- [React-Redux文档](https://react-redux.js.org/)

---

祝你Redux学习愉快！如果有任何问题，欢迎讨论交流。
