## 指令
1. 使用 js-beautify 格式化 @source 文件
2. 使用 acorn 库解析 2107_cli.js，按阈值分割成多个代码块，保存于 claude_code_v_2.1.7/source
   参考实现: `/stage1_analysis_workspace/scripts/split.js` (注意调整脚本内的路径以适应新工作区)



@claude_code_v_2.1.7/analyze/01  分析这个模块 的功能和细节, 和其他模块可能有联动，相关的 source @claude_code_v_2.1.7/source ，对比 @claude_code_v_2/claudecode ，相关的代码还原是否对齐了source，包括所有的细节 是否在 claudecode packages里面和source对齐，相关的逻辑要添加 source 代码的引用，包括source， 例如 Original: zI9 (initializeConfig) in chunks.149.mjs:2065-2105， analyze ，review，align and build pass