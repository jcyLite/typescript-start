/**
 * @description 将目标数组按照相同某个属性值进行归类
 * @date  2021-01-08 14:01:22
 */

type RomoveItem<K extends string,T extends Record<K, any>> = Pick<T,Exclude<keyof T,K>> ;
type ValueType<T extends object, P extends keyof T> = T[P];
export function categorizeDataBasedOnRepetitiveness<K extends string,T extends (Record<K, any> & Record<string,any>)>(target:T[],key:K,transfer?:(param:T)=>T){
    const data:Record<ValueType<T,K>,RomoveItem<K,T>[]> = Object.assign({});
    target.forEach(ii => {
        const item = transfer?.call(void(0),ii)||ii;
        const k:T[typeof key] = item[key]
        if(!data[k]){
            data[k] = [];
        }
        delete item[key]
        data[k].push(item)
    })
    return data
}
const b = categorizeDataBasedOnRepetitiveness([{
    a:`1`,
    b:1234123,
    c:545454
},{
    a:`1`,
    b:432424
},{
    a:`12312`,
    b:4543
}],'a')

// const c = categorizeDataBasedOnRepetitiveness([{
//     a:`1`,
//     b:1234123,
//     c:545454
// },{
//     a:`1`,
//     b:432424
// },{
//     a:`12312`,
//     b:4543
// }],'e')
  
  /**
 * @description 排序算法
 * @date  2020-12-24 10:34:02
 */

/**
 * @description 数组先按一个item的子属性排序后再按另一个子属性(可能再按另一个属性排序)排序
 * @param target 
 * @param sortAttr
 * @return 返回值 排序完成后的结果
 * @date  2020-12-24 10:35:22
 */

export function sort_by_arr<K extends string, T extends Record<K, string>>(
    /** 目标数组 */
    target: T[],
    /** 排序按照数组每一项的对象的哪个key */
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
// console.log(sort_a_after_b([
//     {
//         a:"ab",
//         b:"abc",
//         c:234234
//     },{
//         a:"ac",
//         b:"abe",
//         c:234234
//     },{
//         a:"ab",
//         b:"abd",
//         c:234235
//     }
// ],['a','b']))

  
