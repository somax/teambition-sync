# Teambition Sync

此项目是作用是：调用 teambition 接口，同步数据到自己的数据库，数据库使用 RethinkDB。

另外有一些小工具用来导出内容。

## Usage

```
node . [port]
```
> port 默认为 [3000]

## TODO

- [x] 接口参数可编辑
- [x] 解决分页问题
- [x] 拉取数据后存入数据库
- [ ] 将 Post 导出到 hugo 格式的小工具