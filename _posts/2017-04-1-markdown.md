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

|Result	        |Markdown  
| ----:             |:----
|粗体	            |\*\*TEXT*\*  /  \_\_TEXT_\_ **粗体**
|斜体 	        |\*TEXT\* *斜体*
|删除                 |\~~删除线~~ ~~删除~~
|换行                 |---  /  *** 
|列表	            |* / - / Number / Item
|H1	                |# Heading	
|H2	                |## Heading	
|引用	                |> quote and >>	quote
|Highlight          |==text==
|Paragraphs         |Line space between paragraphs
|Line break         |Add two spaces to the end of the line
|Quotes             |> OR >>
|footer [1]:hello   |[hello][1]
|插入代码           |\`CODE\` OR \```CODE\``` OR Tab  `CODE`
|链接	            |\[Title](http://) [markdown](http://http://www.markdowntutorial.com/)	
|图片	            |\!\[Image Alt Text](http://image) ![icon]()
|图片链接         |\[\!\[Image Alt Text](/path/to/image)](http://) [![alt]()]()
|转义                 |\




>## Markdown Table说明      
>* ---: 为右对齐    
>* :--- 为左对齐      
>* :--: 为居中对齐        
>* ---- 默认居中对齐   

>## Markdowm 页内跳转   
>\[跳转](#jump)       
>\<span id = "jump">匹配的ID\</span>   
>[Top](#top)       

*This text will be italic*  
_This will also be italic_  
**This text will be bold**  
__This will also be bold__  
*You **can** combine them*  

As Grace Hopper said:
> I’ve always been more interested
>> in the future than in the past.
>> thanks all.

### GitHub supports emoji!
:+1: :sparkles: :camel: :tada:
:rocket: :metal: :octocat: 

### TASK LISTS

- [x] this is a complete item
- [ ] this is an incomplete item
- [x] @mentions, #refs, [links](),
**formatting**, and <del>tags</del>
supported
- [x] list syntax required (any
unordered or ordered list
supported)

[^1]: http://www.baidu.com
[1]:http://google.com   
[2]:https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf