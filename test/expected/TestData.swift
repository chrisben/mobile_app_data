/* generated automatically */

import Foundation

struct TestData {
    let tInt: Int
    let tFloat: Double
    let array: [Double]
    let things: [Things]
    struct Things {
        let a: [A]
        let b: Int?
        let c: Int?
        struct A {
            let d: Int
            let e: Int?
        }
    }
}


let testData = TestData(
    tInt: 12,
    tFloat: 11.5,
    array: [
        4, 
        5.5],
    things: [
        TestData.Things(
            a: [
                TestData.Things.A(
                    d: 1,
                    e: nil)],
            b: 2,
            c: nil), 
        TestData.Things(
            a: [
                TestData.Things.A(
                    d: 1,
                    e: 3)],
            b: nil,
            c: 4)])
