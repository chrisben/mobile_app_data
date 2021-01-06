/* generated automatically */

package com.domain.android.app

data class TestData(val tInt: Int, val tFloat: Double, val array: List<Double>, val things: List<Things>) {
    data class Things(val a: List<A>, val b: Int?, val c: Int?) {
        data class A(val d: Int, val e: Int?)
    }
}


@Suppress("SpellCheckingInspection")
val testData = TestData(
    tInt = 12,
    tFloat = 11.5,
    array = listOf(
        4.toDouble(), 
        5.5),
    things = listOf(
        TestData.Things(
            a = listOf(
                TestData.Things.A(
                    d = 1,
                    e = null)),
            b = 2,
            c = null), 
        TestData.Things(
            a = listOf(
                TestData.Things.A(
                    d = 1,
                    e = 3)),
            b = null,
            c = 4)))
