// ---- decorator格式
// function xx(value, setValue) {}
// 或
// const xx = {
//  func: (value, dlScope, propKey) => {},
//  preset: (value, dlScope, propKey) => {},
//  preget: (value) => {},


export type { DLDecorator } from "./type"
// export { StateObject } from "./StateObject"
export { Await } from "./Await"
export { Watch } from "./Watch"
