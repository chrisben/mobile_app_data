/* generated automatically */

package com.domain.android.app;

import java.util.ArrayList;
import java.util.List;

public class TestData {
    private static final TestData mInstance = new TestData();
    public static TestData shared() {
        return mInstance;
    }
    private TestData() {
        this.tInt = 12;
        this.tFloat = 11.5;
        this.array.add(4d);
        this.array.add(5.5);
        {
            TestData.Things v_2_0 = new TestData.Things();
            {
                TestData.Things.A v_3_0 = new TestData.Things.A();
                v_3_0.d = 1;
                v_2_0.a.add(v_3_0);
            }
            v_2_0.b = 2;
            this.things.add(v_2_0);
        }
        {
            TestData.Things v_2_1 = new TestData.Things();
            {
                TestData.Things.A v_3_0 = new TestData.Things.A();
                v_3_0.d = 1;
                v_3_0.e = 3;
                v_2_1.a.add(v_3_0);
            }
            v_2_1.c = 4;
            this.things.add(v_2_1);
        }
    }
    public Integer tInt;
    public Double tFloat;
    public final List<Double> array = new ArrayList<>();
    public static class Things {
        public static class A {
            public Integer d;
            public Integer e;
        }
        public final List<A> a = new ArrayList<>();
        public Integer b;
        public Integer c;
    }
    public final List<Things> things = new ArrayList<>();
}

