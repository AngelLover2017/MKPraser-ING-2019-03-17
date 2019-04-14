# 议题
ECMA-262中描述了具有特定用途的关键字，以下是ECMAScript全部关键字，其中带\*的是第五版的新增关键字：
```javascript
break      do        instanceof        typeof     case   
else       new       var               catch      finally
return     void      continue          for        switch            
while      debugger* function          this       with 
default    if        throw             delete     in         try 
```
纵观，所有关键字，以下关键字可能会有些陌生或是知道但不常用，亦或是根本不知道：
```javascript
instanceof   typeof   debugger*   with   delete   in 
```
除此之外，还有一种`label`语法，类似于C中的goto语句，虽不是关键字，但是也是一种冷门的语法
<hr/>
本篇文章将依次讲解，<code>with</code>、<code>for in语句</code>、<code>label</code>、<code>typeof</code>、<code>instanceof</code>、<code>delete</code>、<code>debugger*</code>
<hr/>

以下部分定义来自《JavaScript高级程序设计（第三版）》

# 再谈JS——不常用的JS语法

### <em>with(expression) statement</em>
JS高程第三版中给出的定义为： *with语句的作用是将代码的作用域设置到一个特定的对象中*

语法为： *with(expression) statement* [expression/表达式] [statement/陈述/可以理解为对expression所代表的对象的后续代码操作]

先来看看基本的语法使用，一个简单的例子
```javascript
// json对象
var person = {
    name : 'lv',
    age  : 20
}
//若不使用with,要修改这两个属性
person.name = 'xf';
person.age  = 23;
//若使用with,如下
with(person){
    name = 'xf';
    age  = 23;
}

```
可以看到，当一个对象中属性很多的时候，且要对一个对象中多个属性做批量修改或赋值
操作的时候,with语句可以简化代码,但是这样也会导致一些问题，比如代码不清晰，易混
淆变量，从而导致代码可读性比较差，这里一个小例子
```javascript
var person = {
    name : 'lv',
    age  : 20
}
var name = 'xf';
with(person){
    name = 'shi';
    document.write(name);
}
document.write(name);
document.write(person.name);
```
第一个write输出到页面的是: `shi` , 第二个write输出到页面的是: `xf`,第三个write
输出到页面是: `shi` ,说明在with中修改的name是person的属性 。

这里的就可以结合JS高程中给出的定义来理解，在`with` 的statement语句块中，变量的作用域会发生变化，比如作为变量的name，在`with`
的statement语句块中不可访问了，原因是此变量名称和`person`的属性名冲突了，而在
`with`中JS会先将expression的属性名映射到statement中,然后属性列表中没有的则解析
为变量名称，这样的规则会导致别人在阅读代码的时候产生歧义，除非加了相应的注释

如果把上面的例子稍微修改一下(将变量name放到with语句块中)，如下
```javascript
var person = {
    name : 'lv',
    age  : 20
}

with(person){
    var name = 'xf';
    name = 'shi';
    document.write(name);
}
document.write(name);
document.write(person.name);
```
输出的结果不定，在`Edge`中测试和上面结果一致，在`Chrome`中测试却是浏览器忽略不现实第二个输出，所以使用with时，在with语句块中不要出现和属性值冲突的变量，否则结果将不可知; 如果变量名不冲突，那么变量放到with语句块内部还是外部都是一样的

#### 由以上几个例子可以看出，当局部变量名称和对象属性名称冲突时，使用with语法会带来很大的问题，另外引用JS高程上的小结
> 严格模式下不允许使用 with 语句，否则将视为语法错误。 
> 由于大量使用 with 语句会导致性能下降，同时也会给调试代码造成困难，因此 
> 在开发大型应用程序时，不建议使用 with 语句。 

### <em>for(property in expression)statement</em>
JS高程上给出的for-in语句的定义为：for-in语句是一种精准的迭代语句，可以用来枚举
对象的属性

语法为：for (property in expression) statement [property/expression中的属性]

比如，下面的例子：

```javascript
for(var propName in window){
    document.write(propName)
}
```
可以枚举出window对象中的所有属性的名称

<b>需要注意的是：</b>
>ECMAScript 对象的属性没有顺序。因此，通过 for-in 循环输出的属性名的顺序是不可预测的。 具体来讲，所有属性都会被返回一次，但返回的先后次序可能会因浏览器而异。

尽管如此，我们往往可以使用for-in语句来达到按顺序遍历数组的目的，例如下面的例子

```javascript
    var arr = new Array();
    for(var i=0;i<10;i++){
        arr[i] = i;
    }
    for(var i in arr){
        document.write(i);
    }
```
输出结果为： 0123456789 

### label语法
label并不是一个关键字而是一种给代码块加上标签的方式，以便以后可以再次返回到标记

处，且往往`label标签`是配合着循环语句使用的,主要是为了减少循环次数，在达到条件

后直接跳出内层循环或者继续外层循环

语法为：label : statement

我们看例子：
```javascript
var num = 0;
end : for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            if(i==5&&j==5){
                break end;
            }
            num++;
        }
    }
    document.write(num);
```
若把`end:`在内循环的位置标为1，在外循环的位置为2，则以下四个组合的输出分别为：

- 1-break 输出为 95
- 2-break 输出为 55
- 1-continue 输出为 99
- 2-continue 输出为 95

<b>需要注意的是</b>
>我们建议如果使用 label 语句，一定要使用描述性的标签，同时不要嵌套过多的循环

<hr/>
暂时先到这里，后期补充！
<hr/>