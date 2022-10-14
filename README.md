## Better-scroll使用
1.wrpper中只能有一个div
2.列表数据更新（滚动高度改变，需要refresh)
3.初始化Better-Scroll必须在页面容器节点渲染完成之后

## 不能滚动问题定位
**查看Better-Scroll滚动实例**
1.wrapperHeight是否小于scrollHeight
2.hasVerticalScroll是否为true
3.click的配置项{ click: true }
