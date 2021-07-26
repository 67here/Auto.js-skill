# Auto.js-skill
# Auto.js的一些常用功能函数 详见js文件

Autojs的崩溃：

## 一、无障碍常见崩溃：

1.无法click(屏幕长 / 2, 屏幕宽 /2)

原因：无法获取屏幕长款

解决：重启手机

2.开启后，明明事先打开了无障碍，却依然疯狂跳设置

原因：其他软件比如ATX的堵塞，或者就是单纯抽风了

解决：全部关掉，或者重启



二、无障碍特殊崩溃

1.[特殊崩溃]运行脚本后瞬间报错，只有launch和log等命令仍然在执行，错误内有线程字样 

触发条件：魅族系统默认是智能后台，导致它杀了后台，但又没完全杀掉。 所以息屏后，再次点亮，就会触发这个情况

解决：关掉相应软件，无障碍重开，设置允许后台

2.[特殊崩溃]运行脚本到click步骤，直接退出 ，没有报错 ，更换脚本 ，依旧如此

解决：这个需要一步步排查才能发现，暂时原因不明，触发条件是体验版的魅族系统+不正确的app版本，解决就是重启手机

## 二、打包apk

使用auto();去代替 auto.waitFor()并做进按钮中， 以避免不必要的疯狂弹窗

## 三、特殊的语法功能

### 1.点击按钮的方法：

#### 1）控件点击

首先推荐的必然是控件点击，它的逻辑是只要能被侦测，就能被点击，无论它是躲在某个悬浮窗后面，还是躲在看不见的下滑栏的底部,即使是app在弹广告，依然可以无视掉。前提是找到控件的特殊属性

#### 2）层级结构

其次仍然是控件点击的延申，层级点击，分为两种点击，通常用于app内的网页展示，表现可以具体参照jd，它的结构极其杂乱
1. 写10多个child，找到它的那个拥有独一无二参数的上家，此时需要pc端控件查看，才能理清思路
2. 另外一种 就是使用indexInParent().depth()去查找，如果怕重复，就可以换为find()，然后再一个个检查

#### 3）识图/色点击
即便层级结构复杂，我也是不推荐识图点击，有个例外，就是1对1定制，只在有限的几个设备上用，那识图确实是个省力的活，但是如果面向很多用户，并不推荐，
理由1 不同人的手机屏幕分辨率和尺寸不同，结果就是ppi不同，缩放不同，识图基本上是像素点对比的，所谓的容错也只是颜色的范围，这种问题同样出现在Windows中的pywinauto上
理由2 除了ppi不同导致图案大小不同，还会导致颜色色彩不同，是的，色彩，rgb值不一样。
修正方案：hamibot作者给的建议，只截取屏幕的一长条区域，进行颜色判定。

#### 4）ocr点击
具体写在功能函数里了，借用外部的ocr识别，拿到字的坐标

#### 5）坐标点击
坐标点击我放在最后，只是因为它即使用了比例坐标，依旧会无法点击，我感觉是aj4.1的bug，当然，1对1定制，可以用

#### 6）轮廓识别

图色的高级版，https://www.yuque.com/yashujs/bfug6u/rdd292

#### 2.Matches 正则

在功能函数里有说它的用法，它的原则是每个控件的text，classname 等等文本内容都不可拆分，所以直接textMatches('某某')，而并没有写全，是无法找到的，所以需要.+ 即可，再加上|就可以实现多个

字符的轮流查找

所以textMatches('.+A.+'|'.+B.+')一句话的功能就相当于

textContains(A).find();
textContains(B).find();

两句话的作用，更何况后者还是两个数组，(我不知道在js里面应该叫什么)，同样它支持包名 类名的匹配，所以，是个优化代码的好方法


