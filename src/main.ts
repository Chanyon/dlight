// // @ts-ignore
// import {ToDoApp} from "./example/ToDoApp/index.tsd";
// // @ts-ignore
import {NestedElement} from "./example/performance";
// // @ts-ignore
// import {TestElement} from "./example/el1.tsd";
// import {render} from "./core/utils";
// import {IfTest, ForTest, FlowTest, EnvTest, LifeCycleTest} from "./example/features"
// import { initNodes, bindParentNode, resolveEnvs } from "./core/Nodes/utils";
// import {SubElement} from "./example/test.tsd"
// @ts-ignore
import {ToDoApp} from "./example/ToDoApp/index.tsd";
import {Counter} from "./example/test.tsd"
export {}

// @ts-ignore
import {TestTest} from "./test.tsd"
import {render, uid} from "./core/utils";
import {SubElement} from "./example/test.tsd"
// @ts-ignore
import {Benchmark} from "./example/performance/benchmark.tsd"

// console.log(t2-t1)
render("#app", new SubElement())



// switch (testType) {
//     case TestType.ToDo:
//         render("#app", new ToDoApp())
//         break
//     case TestType.Benchmark:
//         render("#app", new Benchmark())
//         break
//     case TestType.If:
//         render("#app", new IfTest())
//         break
//     case TestType.For:
//         render("#app", new ForTest())
//         break
//     case TestType.Flow:
//         render("#app", new FlowTest())
//         break
//     case TestType.Env:
//         render("#app", new EnvTest())
//         break
//     case TestType.LifeCycle:
//         render("#app", new LifeCycleTest())
//         break
//     case TestType.MultiElement:
//         render("#app", new MultiElement())
//         break
//     case TestType.NestedElement:
//         render("#app", new NestedElement())
//         break
// }


// let b = []
// for (let _ of [...Array(10000).keys()]) {
//     let j = new SubElement()
//     j._$initDecorators()
//     j.Body()
//     j.Body = () => {}
//     bindParentNode(j._$nodes, j)
//     resolveEnvs(j._$nodes, j)
//     initNodes(j._$nodes)
//     // j._$init()
//     b.push(j)
// }



