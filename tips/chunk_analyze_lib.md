@scripts/find-claude-chunks.js 需要完善oss和claudecode的代码特征； @chunks 里面  json文件是  "purpose": "待分析的代码" 的chunks，需要阅读对应的mjs 代码，提取codeagent（claudecode）和oss相关的特征，完善这个脚本。我们的目标是要发现更多的claudecode的代码特征，你需要重点收集 claudecode 特征更新到脚本里面

当前还有 纯oss 57个，这里面可能存在 false positive，有 claudecode的关键字或者逻辑 没被识别出来。你继续挖掘分析关键字。你深入分析这些纯oss 库，可以尝试从代码逻辑来分析是否存在 agent相关的逻辑，再提取关键字。

你的任务：
1. 深入阅读这些被标注 纯oss的mjs文件，理解里面的逻辑，是 oss 的lib还是包含 claudecode agent的逻辑
2. 如果判断有 claudecode agent的逻辑，你总结这些逻辑的独特关键字，report和更新到find-claude-chunks.js

Never：
1. 你不能通过关键字查找判断，必须逻辑理解
2. 不能文件抽样读取，必须分析全部被标注 oss 的mjs文件


当前分析进度：每轮分析进度都是可信的，你可以跳过这些进度里面判定为纯oss的lib，继续分析剩下的 mjs 文件

第一轮分析：

```

已经完成分析的 chunks 为（去重汇总）：
2, 3, 4, 6, 7, 8, 9, 18, 21, 25,
26, 27, 28, 29, 30, 31, 32, 33,
34, 35, 36, 37, 38, 39, 40, 41,
42, 43, 44, 45, 47, 48, 49, 50,
51, 52, 53, 54, 55, 56, 57, 58,
61, 62

你后面的分析可以跳过这44个文件，继续分析剩余的文件

```
