var tape = require("tape"),
    shape = require("../");

tape("line() returns a default line shape", function(test) {
  var l = shape.line();
  test.equal(l.x()([42, 34]), 42);
  test.equal(l.y()([42, 34]), 34);
  test.equal(l.defined(), true);
  test.equal(l.interpolate().name, "Linear");
  test.equal(l.context(), null);
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L2,3L4,5");
  test.end();
});

tape("line.x(x)(data) observes the specified x-accessor", function(test) {
  var l = shape.line().x(function(d) { return d.x; });
  test.equal(l([{x: 0, 1: 1}, {x: 2, 1: 3}, {x: 4, 1: 5}]), "M0,1L2,3L4,5");
  test.end();
});

tape("line.x(x)(data) observes the specified constant", function(test) {
  var l = shape.line().x(0);
  test.equal(l([{1: 1}, {1: 3}, {1: 5}]), "M0,1L0,3L0,5");
  test.end();
});

tape("line.y(y)(data) observes the specified y-accessor", function(test) {
  var l = shape.line().y(function(d) { return d.y; });
  test.equal(l([{0: 0, y: 1}, {0: 2, y: 3}, {0: 4, y: 5}]), "M0,1L2,3L4,5");
  test.end();
});

tape("line.y(y)(data) observes the specified constant", function(test) {
  var l = shape.line().y(0);
  test.equal(l([{0: 0}, {0: 2}, {0: 4}]), "M0,0L2,0L4,0");
  test.end();
});

tape("line.step(\"linear\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("linear");
  test.equal(l([]), "");
  test.equal(l([[0, 1]]), "M0,1");
  test.equal(l([[0, 1], [2, 3]]), "M0,1L2,3");
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L2,3L4,5");
  test.end();
});

tape("line.step(\"linear-closed\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("linear-closed");
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L2,3L4,5Z");
  test.end();
});

tape("line.step(\"step\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("step");
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L1,1L1,3L3,3L3,5L4,5");
  test.end();
});

tape("line.step(\"step-before\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("step-before");
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L0,3L2,3L2,5L4,5");
  test.end();
});

tape("line.step(\"step-after\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("step-after");
  test.equal(l([[0, 1], [2, 3], [4, 5]]), "M0,1L2,1L2,3L4,3L4,5");
  test.end();
});

tape("line.step(\"basis\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("basis");
  test.equal(l([]), "");
  test.equal(l([[0, 1]]), "M0,1");
  test.equal(l([[0, 1], [1, 3]]), "M0,1L0.16666666666666666,1.3333333333333333C0.3333333333333333,1.6666666666666667,0.6666666666666666,2.3333333333333335,0.8333333333333334,2.6666666666666665L1,3");
  test.equal(l([[0, 1], [1, 3], [2, 1]]), "M0,1L0.16666666666666666,1.3333333333333333C0.3333333333333333,1.6666666666666667,0.6666666666666666,2.3333333333333335,1,2.3333333333333335C1.3333333333333333,2.3333333333333335,1.6666666666666667,1.6666666666666667,1.8333333333333333,1.3333333333333333L2,1");
  test.end();
});

tape("line.step(\"basis-open\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("basis-open");
  test.equal(l([]), "");
  test.equal(l([[0, 0]]), "");
  test.equal(l([[0, 0], [0, 10]]), "");
  test.equal(l([[0, 0], [0, 10], [10, 10]]), "M1.6666666666666667,8.333333333333334");
  test.equal(l([[0, 0], [0, 10], [10, 10], [10, 0]]), "M1.6666666666666667,8.333333333333334C3.3333333333333335,10,6.666666666666667,10,8.333333333333334,8.333333333333334");
  test.equal(l([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]), "M1.6666666666666667,8.333333333333334C3.3333333333333335,10,6.666666666666667,10,8.333333333333334,8.333333333333334C10,6.666666666666667,10,3.3333333333333335,8.333333333333334,1.6666666666666667");
  test.end();
});

tape("line.step(\"basis-closed\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("basis-closed");
  test.equal(l([]), "");
  test.equal(l([[0, 0]]), "M0,0Z");
  test.equal(l([[0, 0], [0, 10]]), "M0,6.666666666666667L0,3.3333333333333335Z");
  test.equal(l([[0, 0], [0, 10], [10, 10]]), "M1.6666666666666667,8.333333333333334C3.3333333333333335,10,6.666666666666667,10,6.666666666666667,8.333333333333334C6.666666666666667,6.666666666666667,3.3333333333333335,3.3333333333333335,1.6666666666666667,3.3333333333333335C0,3.3333333333333335,0,6.666666666666667,1.6666666666666667,8.333333333333334");
  test.equal(l([[0, 0], [0, 10], [10, 10], [10, 0]]), "M1.6666666666666667,8.333333333333334C3.3333333333333335,10,6.666666666666667,10,8.333333333333334,8.333333333333334C10,6.666666666666667,10,3.3333333333333335,8.333333333333334,1.6666666666666667C6.666666666666667,0,3.3333333333333335,0,1.6666666666666667,1.6666666666666667C0,3.3333333333333335,0,6.666666666666667,1.6666666666666667,8.333333333333334");
  test.equal(l([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]), "M1.6666666666666667,8.333333333333334C3.3333333333333335,10,6.666666666666667,10,8.333333333333334,8.333333333333334C10,6.666666666666667,10,3.3333333333333335,8.333333333333334,1.6666666666666667C6.666666666666667,0,3.3333333333333335,0,1.6666666666666667,0C0,0,0,0,0,1.6666666666666667C0,3.3333333333333335,0,6.666666666666667,1.6666666666666667,8.333333333333334");
  test.end();
});

tape("line.step(\"cardinal\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("cardinal");
  test.equal(l([]), "");
  test.equal(l([[0, 1]]), "M0,1");
  test.equal(l([[0, 1], [1, 3]]), "M0,1L1,3");
  test.equal(l([[0, 1], [1, 3], [2, 1]]), "M0,1Q0.7999999999999999,3,1,3Q1.2,3,2,1");
  test.equal(l([[0, 1], [1, 3], [2, 1], [3, 3]]), "M0,1Q0.7999999999999999,3,1,3C1.3,3,1.7,1,2,1Q2.2,1,3,3");
  test.end();
});

tape("line.step(\"cardinal-open\")(data) generates the expected path", function(test) {
  var l = shape.line().interpolate("cardinal-open");
  test.equal(l([]), "");
  test.equal(l([[0, 1]]), "");
  test.equal(l([[0, 1], [1, 3]]), "M1,3");
  test.equal(l([[0, 1], [1, 3], [2, 1]]), "M1,3");
  test.equal(l([[0, 1], [1, 3], [2, 1], [3, 3]]), "M1,3C1.3,3,1.7,1,2,1");
  test.end();
});
