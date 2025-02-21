import {parseDlightFile} from "@dlightjs/transpiler"
import optionalThisPlugin from "babel-plugin-optional-this"
import { transformSync } from '@babel/core';

const transformOptionThisOption =  {
    plugins: [
        optionalThisPlugin(),
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-syntax-do-expressions',
        ['@babel/plugin-syntax-decorators', { legacy: true }],
    ],
}
function transformOptionThis(code) {
    return transformSync(code, transformOptionThisOption).code
}

export default function({jsd=true, jsx=true, optionalThis=false}={}) {
    return {
        name: 'dlight',
        enforce: 'pre',
        config(config) {
            return {
                ...config,
                esbuild: {
                    ...config.esbuild,
                    include: /\.(js|ts|jsd|tsd|jsx|tsx)$/,
                    loader: 'ts',
                },
            };
        },
        transform(code, id) {
            if (jsd) {
                if (id.endsWith(".jsd") || id.endsWith(".tsd")
                    || id.endsWith(".view.js") || id.endsWith(".view.ts")) {
                    if (optionalThis) code = transformOptionThis(code)
                    return parseDlightFile(code, "jsd")
                }
            }
            if (jsx) {
                if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
                    if (optionalThis) code = transformOptionThis(code)
                    return parseDlightFile(code, "jsx")
                }
            }
            return code
        }
    }
}

