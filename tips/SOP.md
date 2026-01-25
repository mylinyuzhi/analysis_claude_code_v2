## 指令
1. 使用 js-beautify 格式化 @source 文件
2. 使用 acorn 库解析 2107_cli.js，按阈值分割成多个代码块，保存于 claude_code_v_2.1.7/source
   参考实现: `/stage1_analysis_workspace/scripts/split.js` (注意调整脚本内的路径以适应新工作区)




@claude_code_v_2.1.7/analyze/ 13 14 15  分析模块 的功能和细节, 和其他模块可能有联动，相关的 source @claude_code_v_2.1.7/source ，@claude_code_v_2.1.7/analyze/00_overview 是analyze 的overview，可以快速了解信息和 symbols mapping 。对比 @claude_code_v_2.1.7/claudecode ，你要查找和分析相关的功能代码实现是否对齐了source被混淆后的代码，包括所有的细节 ，packages实现相关的逻辑要时添加 source 代码的引用，引入的信息 包括source， 例如 Original: zI9 (initializeConfig) in chunks.149.mjs:2065-2105。 analyze ，review，align the code and build pass。
要求：
1. 不需要更新md文档，只需要 在 @claude_code_v_2.1.7/claudecode 严格还原对齐 source 源码逻辑，禁止 placeholder ，mock，stub，unimplemented，unsupported 等 跳过实现
2. 还原后代码函数命名和字段命名的可读性强，避免出现 J I D V 这些命名
3. 关键的逻辑需要comment 注释
4. 已有的代码要充分理解逻辑，比对source，再修改，确保修改是可以帮助提升对齐
5. 对齐 `claude_code_v_2.1.7/claudecode`， Build 通过
