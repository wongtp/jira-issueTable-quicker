<h1 align="center">jira-issueTable-quicker</h1>
<p align="center">这是一个可以帮助我们在问题表格页快速编辑问题的浏览器插件</p>
<p align="center">
  <a rel="noreferrer noopener" href="#"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white&color=blue">
  </a> 
  <a rel="noreferrer noopener" href="#"><img alt="Edge Addons" src="https://img.shields.io/badge/Edge-141e24.svg?&style=for-the-badge&logo=microsoft-edge&logoColor=white&color=blue">
  </a>  
</p>

<a href="README_EN.md">English</a>

# 功能介绍
[jira](https://www.atlassian.com/software/jira) 不可否认是一个可以帮助有效提高工作效率的工具，但是我们在使用 jira 时使用问题表格可以让我们看到跟多的内容而不用关注细节，但是目前在问题表格页无法较快地编辑，基于这个问题，有了这个插件，示例功能如下:

原始表格内容
![原始的表格](assets/originIssueTable.png)

使用插件后双击 summary 字段变成输入框后可以直接修改 summary
![使用插件后的表格](assets/doubleClickSummary.png)


# 怎么使用？
 1. 进入浏览器拓展管理页面；
 2. 打开浏览器开发者选项；
 3. 加载已解压的拓展程序；
 4. 选择 src 目录；


# 已实现功能
 - ✅ 双击编辑大部分纯 input 输入框字段；
 - ✅ 双击编辑大部分下拉选择框字段；
 - ✅ 双击编辑 assignee 字段；
 - ✅ 双击编辑 radio 类型字段；
 - ⬜️ 双击其他类型字段进行编辑；
 

# 已知问题
 - ⚠️ 部分字段双击进入可编辑状态后，其实还不支持修改值，例如用户选择 multiuserpicker 类型的字段；
 - ⚠️ 部分字段双击进入可编辑状态后，如果不修改值，则无法还原为不可编辑状态；
 - ⚠️ 由于双击表格时同步加载编辑表单数据，如果网速比较慢，可能会等待比较久才能进入到可编辑状态，后续考虑增加预加载或者缓存；
