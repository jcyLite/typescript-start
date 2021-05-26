# TypeScript之泛型及一些关键字的用法

## Promise反解、typeof及infer的用法

```typescript
//demo1
type UnPromisify<T> = T extends (...args:any[])=>Promise<infer U> ? U :any;
async function promiseDemo(){
    return true
}
const a : UnPromisify<typeof promiseDemo> = false;
```

首先我们来分析下这个demo:
这里涉及几个typescript关键字：infer和typeof，这里的infer指的是抽象定义一个泛型U；如果能满足返回值是一个Promise对象时，则返回Promise对象传入的泛型参数，否则返回any类型
typeof则是讲promiseDemo转换为它的类型，UnPromisify是一个泛型，将typeof promiseDemo作为一个类型参数传入UnPromisify中，根据情况推到返回类型。

总结：所以我们如果需要反解类型，需要抓住infer这个关键字

## 泛型广泛运用于算法之中

```typescript
//demo2
function sort_a_after_b<K extends string, T extends Record<K, string>>(
    target: T[],
    sortAttr: K[]
): T[] {
    function mkSortIndex(name: string, start: number): number {
        const a = name.charCodeAt(start)
        if (a == 95) {
            //下划线的情况单独考虑
            return 150
        } else {
            return a
        }
    }
    function mkSortItem(aa: string, bb: string) {
        let i = 0
        let b = mkSortIndex(bb, 0)
        let a = mkSortIndex(aa, 0)
        while (b == a) {
            i++
            b = mkSortIndex(bb, i)
            a = mkSortIndex(aa, i)
        }
        return a - b
    }
    return target.sort((before,after)=>{
        for(let i = 0;i<sortAttr.length;i++){
            if(before[sortAttr[i]] != after[sortAttr[i]]){ //如果两者名字不相同,就先按这一项排序
                return mkSortItem(before[sortAttr[i]], after[sortAttr[i]])
            }
        }
        return 0;
    })
}
```

首先我们来分析下这个demo:
这个demo的算法第一个参数是`object[]`类型的数组，第二个参数是`string[]`类型的数组，目的是将target转换成按照第二个参数数组的每一项排序的结果。
这里入参target的是接受泛型变量的`T[]`，则返回值类型应该与target的保持一致，所以也是`T[]`,另外第一个参数与第二个参数的联系是：第二个参数的每一项是第一个参数中的每一项中的属性名。
借助typescript中的Record基本类型，使用`T extends Record<K, string>`来衔接T与K的关系，

总结：泛型可以理解为虽然我们不知道入参与出参及入参第一项与第二项等的类型结构，但是因为我们知道他们之间的联系，通过泛型可以串联它们之间的联系。

## typescript中的关键字keyof

```typescript
const a = {
    'zh':{
        'a':'a'
    },
    'en':{
        'a':'a'
    }
}
function getTargetKeyValue<T = typeof a>(target:T,key: keyof T):typeof a['zh'] {
    return target[key]
}
const b = getTargetKeyValue(a,'zh');
```

首先我们来分析下这个demo:
这个方法是输入第一个参数为一个对象，第二个参数为一个字符串（必须是第一个对象中的已知属性名），我们知道typescript对于简单类型可以自动推导，所以通过typeof关键字可以获取目标对象类型，
而第二个参数是第一个参数中已知属性，就这个demo而言，应该是'zh'|'en',通过keyof关键字则可返回这个类型中所有key的集合。

总结：keyof关键字可以获取已知简单类型的所有子属性名的集合。

> 最后留下espace群号：399150017（ts高阶用法踩坑队），欢迎各位大佬入坑。
