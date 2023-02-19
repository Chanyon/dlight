# DLight

[EN](../../packages/@dlightjs/dlight/README.md) | 中文

JSD | [JSX](./README-dlight-jsx.md)

# 提示

在文档中搜索🌟来查看重要概念。

# 快速开始

DLight使用[vite](https://vitejs.dev/)来构建应用。我们主要使用[这个插件](https://www.npmjs.com/package/vite-plugin-dlight-transpiler)来将jsx/jsd文件编译成纯js代码。

三种方法来尝试DLight.js

1. 使用脚手架来构建DLight应用 (**这个功能仍在开发中**)

```shell
npm install -g @dlightjs/cli
create-dlight-app my-first-dlight-app
```

2. Clone 这个仓库 https://github.com/dlight-js/dlight-vite-template 来快速开始.
3. 🌟 在 [codesandbox](https://codesandbox.io/p/sandbox/dlight-vite-quickstart-4tgogd) 中尝试。

## 渲染

将你的dlight组件挂在到任何**含有id的html元素**上

```typescript
import {render} from "@dlightjs/dlight"
import {MyComp} from "./MyComp.jsd"

render("app", MyComp)
```

## 自定义组件

首先，DLight没有使用模版/函数式组件。它使用**类组件**，但不是想React的类组件那样。我们不是很喜欢将嵌套的逻辑写在视图里面并且希望将视图和逻辑分离，使用我们选择不使用函数式组件。同时，我们想要让我们的组件尽可能的**灵活**，所以迎来了我们的DLight类组件。我们意识到写一个类组件有一个很大的心智负担 -- 'this'。你必须用this.xxx来访问一个成员变量。所以**目前我们正在构建一个babel插件来在类中"消除this"并且自动和对象绑定**。可惜的是现在你不得不写 'this.value'。但是这也还行，对吧？

```jsx
// -> ./MyComp.jsd
import {View} from "@dlightjs/dlight"

export class MyComp extends View {
  @State count = 0  
  countPlus1 = this.count + 1  

  Body() {
    h1("hello, dlight js, jsd")
    div(this.count)
    div(this.count + 1)
    button("+")
      .onclick(() => {
        this.count ++
      })
    button("-")
      .onclick(() => {
        this.count --
      })
  }
}
```

## 传递一个参数

Dlight 使用 @Prop 来标明这个成员变量是不是一个参数。

1. **跟着传递者state改变**的响应式参数
   
   `<div id="other-comp" />` in `MyOtherComp` will change its innerText if `count` in `MyComp` changes.
   
   ```jsx
   import {View, required} from "@dlightjs/dlight"
   
   class MyOtherComp extends View {
     // "required" is just `const required = undefined as any`, we use this to identify that this prop must be passed
     @Prop countProp = required 
   
     Body() {
       div(this.countProp)
         .id("other-comp")
     }
   }
   
   export class MyComp extends View {
     @State count = 0
   
     Body() {
       button("+")
         .onclick(() => {
           this.count ++
         })
       button("-")
         .onclick(() => {
           this.count --
         })
       MyOtherComp()
       	.countProp(this.count)
     }
   }
   ```
   
2. 一个响应式参数，它会跟着传递者的state改变，并且传递者的state也会同时跟着它改变。这说明这两个变量**互相"绑定"**。
   
   `<div id="mycomp" />` in `MyComp` will change its innerText if `countPropState` in `MyOtherComp` changes.
   
   ```jsx
   import {View, required} from "@dlightjs/dlight"
   
   class MyOtherComp extends View {
     @PropState countPropState = required 
   
     Body() {
       button("+")
         .onclick(() => {
           this.countPropState ++
         })
       button("-")
         .onclick(() => {
           this.countPropState --
         })
   
     }
   }
   
   export class MyComp extends View {
     @State count = 0
   
     Body() {
       div(this.cout)
         .id("mycomp")
       MyOtherComp()
       	.countPropState(this.count)
     }
   }
   ```
   

# JSD

## 🌟为什么使用JSD

因为我很喜欢iOS 和 [SwiftUI](https://developer.apple.com/xcode/swiftui/)并且不喜欢任何和html长得像的语法，比如jsx。

所以如果你像我一样，就尝试一下jsd并让你的js代码变得更js一点！如果不是，也尝试一下。还不是，忽略它并投降jsx的怀抱因为我们也支持它。


## 基础概念

### 例子

```js
...
Body() {
  div("this auto set it inner text")
  div {
    button("first child")
      .onclick(() => {
        console.log("write dot prop")
      })
    div()
    	.id("second-child-div")
    	.innerText("you can also set prop like this")
  }
  "plain text node"
  `this is text node too, ${this.anyMessage}`
  _("this is expression")
}
...
```

### 标签和节点

我们称 `Body` 中的像 `div` / `MyOtherComp` / `If` 的字符串为标签。然后它会在编译阶段编译成一个节点。我们有这些协议：

1. 小写字母开头的标签是一个html标签, e.g. `div` `button`

2. 大写字母开头的标签是一个自定义组件的tag, e.g. `MyComp` `MyOtherComp`

3. 大写字母开头的标签可能是一个内置标签，

   当前内置标签包括： `If` `ElseIf` `Else` `For` `Env` `_`

我们同样还有隐藏标签：被`"` \ `'` \ ` 包裹的字符串称作textNode。通过 `document.createTextNode()` 创建。

### 表达式

在jsx中，被`{}`包裹的字符串被称作表达式。e.g.

```jsx
...
Body = (
  <div>
    { !console.log("expression just like you used to write") && "display this sentence" }
    { this.show && <div>will show if this.show is true</div> }
  </div>
)
...
```

在jsd中，我们通过`_`来标明表达式。在表达式用，我们使用`do{}`来标注它的内容是一个jsd Body的子模块。e.g.

```jsx
...
Body() {
  div {
    _(!console.log("expression just like you used to write") && "display this sentence")
    _(this.show && do {
      div("will show if this.show is true")
    })
  }
}
...
```

### 参数

三种方法来设置一个参数，第一种和第二种是一样的。

1. ```js
   TagName({ prop1: "hello", prop2: "world" })
   ```

2. ```TagName()
   TagName()
     .prop1("hello")
     .prop2("world")
   ```

3. ```js
   TagName("your _$content prop")
   ```

对于不同的标签，参数代表不同的东西。

1. Html 标签

   - 1/2 参数代表html标签的属性。

     e.g. `div("hello").id("hello-div")` => `el.id = "hello-div"`

   - 1/2 以"_"开头的参数是样式属性的简写。

     e.g. `div("hello")._color("red")` => `el.style.color = "red"`

   - 3 参数可以设置html元素的innerText并且会被它的子元素替代。

     e.g. `div("hello")` => `el.style.innerText = "hello"`

     ```js
     div("this will not show") {
       div("because I'm its child, I overwrite its innerText")
     }
     ```

2. 自定义组件

   - 1/2 参数就像 `Quick start - pass a prop` 节说的那样.

   - 3 参数设置自定义组件的名叫`_$content`的参数。

     ```js
     import {View, required} from "@dlightjs/dlight"
     
     class MyOtherComp extends View {
       @Prop _$content = required
     
       Body() {
         div(this._$content) // display "hello world"
       }
     }
     
     export class MyComp extends View {  
       Body() {
         MyOtherComp("hello world")
       }
     }
     ```

3. 内置标签

   - 见 `特性` 一节

### 贡献

Jsd仍在设计中，如果你有很好的设计想法或者任何关于它的问题，欢迎提出一个issue或者打开一个discussion！

# 响应式

在 Dlight中, 响应式**简单并高效**!

## State

- 使用 **@State** 来标明一个成员变量是**响应式变量**。当这个变量被set，所有用到这个变量的html元素上的属性都会重新计算这个属性（🌟不会重新渲染这个元素，它有更细的粒度！）

- **两个特例**

    1. 如果你使用**剪头函数**来包裹这个变量，dlight会**认为它是一个回调**，想`onclick`一样。 所以没有必要来重新设置这个属性，于是在这个属性上响应式就会丢失。如果出于某种原因你仍想要dlight来监听它，使用`function`而不是`arrow function`。

       e.g. `() => { console.log(this.count) }` => won't be listened

       `function() { console.log(this.count) }` => will be listened

    2. 如果你set了一个state，我们不会监听它因为这回引起依赖循环。

       比如说，想象你在使用React，`this.count = 1` 就是 `setCount(1)`，使用我们不会监听count的变化。另一个例子：`this.count = this.count + 1`，在React中是`setCount(prev => prev+1)`。同样的，我们不会让DLight追踪它。

- 例子

  ```jsx
  import {View} from "@dlightjs/dlight"
  
  export class MyComp extends View {
    @State count = 0
  
    Body() {
      button("+")
        .onclick(() => {
          this.count ++  // this won't be listened because it's inside an arrow function
        })
      button("-")
        .onclick(() => {
          this.count --
        })
      div(this.count)  // everytime you click the button, this div's innerText will be reset
    }
  }
  ```

## 依赖链

在目前市场上所有的框架中，没有一个能**无痛苦的使用`derived state`**（当然其他mvvm的框架都很好，我喜欢react，vue，solid，svelte，...）。

比如说我们有一些人的姓和名并且我们想要把他们组合起来变成完整的姓名。

React会这么做：

```jsx
function ShowMeTheName() {
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Doe')

  const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])

  return <div>{fullName}</div>
}
```

Solid会这么做：

```jsx
function ShowMeTheName() {
  const [firstName, setFirstName] = createSignal('John')
  const [lastName, setLastName] = createSignal('Doe')

  // use "createMemo" to avoid re-calculate in solid
  const fullName = createMemo(() => `${firstName()} ${lastName()}`)

  return <div>{fullName()}</div>
}
```

🌟这是DLight的做法：

```jsx
class ShowMeTheName extends View {
  @State firstName = 'John'
  @State lastName = 'Doe'
  fullName = `${this.firstName} ${this.lastName}`

  Body() {
    div(this.fullName)
  }
}
```

哈！没错，**你不需要做任何事情来让一个`derived`的成员变量变成响应式**。DLight会自动使`fullName`变得响应因为它是从一个state变量中延伸出来的。每一次`firstName` 和 `lastName`改变，`fullName`都只会重新计算一次并且改变任何使用到它都html元素都属性。

**所以，什么是依赖链**

🌟这是一个用来描述DLight的响应式是如何工作的术语。所有在链上的依赖都会变得响应式因为这个链的头节点（它是个state变量）并且**会被重新计算如果头节点改变了**，然后所有和它相关的html元素的属性也会同样被改变。

依赖链例子:

1. 链
   
   `count => null`
   
   `flag => null`
   
   ```js
   class DepChainExample1 extends View {
     @State count = 0
     @State flag = true
   }
   ```

2. 链
   
   `count => countPlus1 => countPlus1Plus1 => null`
   
    `=> countPlus2 => null`
   
   `flag => noFlag => null`
   
   ```js
   class DepChainExample2 extends View {
     @State count = 0
     countPlus1 = this.count + 1
     countPlus2 = this.count + 2
     countPlus1Plus1 = this.countPlus1 + 1
   
     @State flag = true
     noFlag = !this.flag
   }
   ```

3. 链
   
   `count => null`
   
   ```js
   class DepChainExample3 extends View {
     @State count = 0
     // logCount will not be added into dep-chain because it's wrapped with an arrow function
     logCount = () => {
       console.log(this.count)
     }
   }
   ```

4. 链
   
   `count => logCount => null`
   
   ```js
   class DepChainExample4 extends View {
     @State count = 0
     // logCount will be added into dep-chain because it's wrapped with a function
     logCount = function() {
       console.log(this.count)
     }.bind(this)
   }
   ```

5. 使用依赖链来进行 `useEffect`?

   DLight不会有很多需要"副作用"的场景，因为**`derived`变量可以解决大部分**。但是，如果你仍想要使用它来监听改变或者有其他的原因，你可以试试这样：
   
   ```js
   class DepChainExample5 extends View {
     @State count = 0
     // watchCountChange will be added into dep-chain because it's wrapped with a function
     // and this function will re-called if "count" changes
     watchCountChange = function() {
       console.log(this.count)
     }.call(this)
   }
   ```

6. 🌟我的变量是一个函数的返回值，我怎么让他变得响应？

   有两种方法来实现它。永远记住肩头函数和setValue是唯一的特例，其他的表达式都会自动收集依赖如果你使用到了在依赖链中的变量。

    1. 就像我们实现 `useEffect` 那样
   
   ```js
   class DepChainExample6_1 extends View {
     @State count = 0
   
     countPlus1 = function() {
       // do other stuff.....
       return this.count+1
     }.call(this)
   }
   ```

    2. 把函数拆分出来
   
   ```js
   class DepChainExample6_1 extends View {
     @State count = 0
     getCount = count => {
       // do other stuff.....
       return count
     }
     countPlus1 = this.getCount(this.count)
   }
   ```

# 生命周期

在DLight中，我们给自定义组件和html元素提供真正的生命周期。

## Html 元素

`willAppear` / `didAppear` / `willDisappear` / `didDisappear`

- 调用时机可以用下面的伪代码来描述：
  
  ```js
  // appear
  el.willAppear()
  parentEl.appendChild(el)
  el.didAppear()
  
  // disappear
  el.willDisappear()
  el.remove()
  el.didDisappear()
  ```

  DLight只会调用这些钩子函数当这个元素生成或者移除。这也是为什么我们叫它"真正的"生命周期。

- 用法
  
  ```js
  ...
  Body() {
    div 
      .willAppear(() => {
        console.log("I will appear")
      })
      .didAppear=(el => {
        console.log(`I just appeared, I am ${el}`)
      })
  }
  ...
  ```


## 自定义组件

`willMount` / `didMount` / `willUnmount` / `didUnmount`

- 调用时机可以用下面的伪代码来描述：
  
  ```js
  // mount
  MyComp.willMount()
  MyComp.allHTMLEls.willAppear()
  MyComp.allHTMLEls.didAppear()
  MyComp.didMount()
  
  // unmount
  MyComp.willUnmount()
  MyComp.allHTMLEls.willDisappear()
  MyComp.allHTMLEls.didDisappear()
  MyComp.didUnmount()
  delete MyComp
  ```

- 用法
  
  ```jsx
  class MyComp extends View {
    didMount() {
      console.log("I just mounted")
    }
    willUnmount() {
      console.log("bye-bye")
    }
  }
  ```

# 特性

## 自定义组件的子组件

你可以通过内置的成员变量 `this._$children` 和 `this._$childrenFunc` 来拿到自定义组件中的子组件。他们的区别在于`this._$children`的子是一个dlight中的节点但`this._$childrenFunc`的子是**一个返回这个节点的函数**。如果你想要**构建一个条件化的组件并且调用这个函数来返回这个节点很多次**像`If`或者`Route`，你可以用后者。

```jsx
import {View} from "@dlightjs/dlight"

class MySubComp extends View {
  // this._$children will be div("hello") and div("dlight") in this case
  // this._$childrenFunc will be () => div("hello") and () => div("dlight") in this case


  Body() {
    _(this._$children)
    _(this._$childrenFunc.map(childFunc => childFunc()))
  }
}

export class MyComp extends View {
  Body() {
    MySubComp {
      div("hello")
      div("dlight")
    }
  }
}
```

## 自定义组件的名字

你可以通过 `this._$tag` 来拿到你的自定义组件或者子组件的名字。（这个名字在打包后类名转成其他的也不会变）

```jsx
import {View} from "@dlightjs/dlight"

class ThisIsMyComponentHah extends View {
  didMount() {
    console.log(this._$tag) // will log "ThisIsMyComponentHah"
  }
}
```

## 获取元素

有时候，你需要访问DOM上的html元素并且手动改变它。

🌟HTML元素和自定义组件都可以拿到元素（数组）

```jsx
import {View} from "@dlightjs/dlight"

class MySubComp extends View {
  Body() {
    div("hello")
    div("dlight")
  }
}

class MyComp extends View {
  myHTMLElement?
  myHTMLElements?
  didMount() {
    console.log(myHTMLElement) // will be <div>good morning</div>
    console.log(myHTMLElements) // will be [<div>hello</div>, <div>dlight</div>]
  }
  Body() {
    div("good morning")
    	.element(this.myHTMLElement)
    MySubComp()
  		.element(this.myHTMLElements)
  }
}
```

## 子视图

Build reusable subviews inside your components. Props inside @View will automatically be reactive.

```js
class MyComp extends View {
  @View
  MyButton({id}) {
    button(`I am button ${id}`)
  }
  Body() {
    for (let i of [1,2,3]) {
      this.MyButton()
      	.id(i)
    }
  }
}
```

## 复杂标签

Force a expression to be a custom tag.

```js
class MySubComp extends View {
  Body() {
    "hello"
  }
}

class MyComp extends View {
  myTagObject = {
    getTag: () => MySubComp
  }
  Body() {
    tag(this.myTagObject.getTag())()
  }
}
```

Force a expression to be a html tag.

```js
class MyComp extends View {
  myTagObject = {
    getTag: () => "span"
  }
  Body() {
    html(this.myTagObject.getTag())()
  }
}
```

# 内置标签

## 数组

1. 首先你可以使用没有优化的数组map来建立一个数组元素，但是一旦这个数组改变了，即使是它里面的一个东西，整个数组都会被删除并且重新构建，所以**除非这是个固定数组或者你知道你在干什么**，不然别用它。

   ```jsx
   ...
   Body() {
     div {
       _(this.array.map(item => do {
           div(item)
       }))
     }
   }
   ...
   ```

2. 🌟使用内置支持的For节点来进行**优化**。

   你可以使用任何你写在js `for` 循环里面的 **"of"表达式**。

   e.g. -> `let item of array` / `let [key, item] of array.entries()` / `let {key1, key2} of array` / ...

   ```jsx
   ...
   Body() {
     div {
       for (let item of this.array) {
         div(item)
       }
     }
   }
   ...
   ```

   此外，我们可以使用一个`key`参数来将元素和这个key绑定。

   ```jsx
   ...
   Body() {
     div {
       for (let {id, item} of this.array) { [id]
         div(item)
       }
     }
   }
   ...
   ```

## 条件化

1. 你可以首先像你写在React里面那样使用 ( condition && YourElement )。

   ```jsx
   ...
   Body() {
     div(this.show && "show me")
   }
   ...
   ```

2. 🌟使用内置支持的 If/ElseIf/Else 节点来进行**条件中断**.

   ```jsx
   ...
   Body() {
     div {
       if (this.show) {
         "show me"
       } else if (this.alsoShow) {
         "also show me"
       } else {
         "don't show me"
       }
     }
   }
   ...
   ```

## 环境变量

- 提供一个内置的简单方便的上下文管理。
- `environment`的底层原理和DLight中传递参数是一样的，所以**没有额外开销**！
- 我们使用 `@Env` 来标明它。

```js
import {View, required} from "@dlightjs/dlight"

class MyNestComp extends View {
  @Env myMessage = "default value"
  Body() {
    div(this.myMessage)  // will show "use me anywhere inside this environment"
  }
}

class MySubComp2 extends View {
  @Env myMessage = "default value"
  Body() {
    div(this.myMessage)  // will show "use me anywhere inside this environment"
  }
}

class MySubComp1 extends View {
  @Env myMessage = "default value"
  Body() {
    MyNestComp()  // call MySubComp2
    div(this.myMessage)  // will show "use me anywhere inside this environment"
  }
}

export class MyComp extends View {  
  Body() {
    Env({myMessage: "use me anywhere inside this environment"}) {
      MySubComp1()
      MySubComp2()
    }
  }
}
```
