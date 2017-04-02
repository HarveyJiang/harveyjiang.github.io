---
layout:     post
title:      Markdown 基础语法
date:       2017-04-1
author:     Harvey
category:   record
weather:    晴
header-img: 
tags: 手册
---

<span id ="top"></span>

# Markdown 简易入门指南   
---
      
[参考1](http://www.markdowntutorial.com/lesson/2/)        
[参考2](https://help.ghost.org/hc/en-us/articles/224410728-Markdown-Guide)        
[参考3](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf)        

|Result                 |Markdown  
| ----:                 |:----
|粗体                     |\*\*TEXT*\*  /  \_\_TEXT_\_ **粗体**
|斜体 	                |\*TEXT\* *斜体*
|删除                     |\~~删除线~~ ~~删除~~
|换行                     |---  /  *** 
|列表	                    |* / - / Number / Item
|H1	                    |# Heading	
|H2	                    |## Heading	
|引用	                    |> quote and >>	quote
|段落间距                   |Enter空行
|换行                     |末尾两个空格
|脚注                     |\[Google]\[1] [Google][1]
|插入代码                   |\`CODE\` OR \```CODE\``` OR Tab  `CODE`
|链接	                    |\[Title](http://) [markdown](http://http://www.markdowntutorial.com/)	
|图片	                    |\!\[Image Alt Text](http://image) ![icon]()
|图片链接                   |\[\!\[Image Alt Text](/path/to/image)](http://) [![alt]()]()
|页内跳转                   |\[跳转](#jump)   [Top](#top) 
|转义                     |\

[TOC]
>## Markdown Table说明      
|Markdown|Result
|---:|:---
|**---:**|为右对齐   
|**:---**|为左对齐      
|**:---:**|为居中对齐        
|**----**|默认居中对齐   
     
### 引用
As Grace Hopper said:
> I’ve always been more interested
>> in the future than in the past.
>> thanks all.

### GitHub supports emoji!
:+1:        
:sparkles:  
:camel:     
:tada:      
:rocket:        
:metal:     
:octocat: 

### TASK LISTS

- [x] this is a complete item
- [ ] this is an incomplete item
- [x] @mentions, #refs, [links](),
**formatting**, and <del>tags</del>
supported
- [x] list syntax required (any
unordered or ordered list
supported)

脚注\[1]:http://google.com       

[1]:http://google.com
