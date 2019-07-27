/*** Can't import in bare js and using type="module"
 *   brings up a bunch of CORS errors
 *   so to work around, this script must be loaded
 *   on the page _AFTER_ the script it is testing, and
 *   "imports" are assumed by the available globals
 */

function assertEqual(asserted, expected) {
    if (asserted != expected) {
        throw new Error("Assertion failed: " + asserted + " != " + expected);
    }
}

function test_parseTime_converts_time_to_integer() {
    let clock = new Clock();
    parsed = clock.parseTime('0:00:00.1');
    expected = "1";
    expected = expected.padStart(24, "0");
    assertEqual(parsed, expected);
}

function test_timeToStr_converts_integer_time_to_display_string() {
    let clock = new Clock();
    parsed = clock.timeToStr(1);
    expected = "0:00:00.1";
    assertEqual(parsed, expected);
}

function test_setTime_sets_the_time_w_string_or_int_time() {
    let clock = new Clock();
    expected = 1000;
    clock.setTime(expected);
    assertEqual(clock.time, expected);

    clock = new Clock();
    expected = 15;
    clock.setTime('0:00:01.5');
    assertEqual(clock.time, expected);
}

function test_drawClock_uses_the_objects_time() {
    mock_ctx = {
        clearRect: (...args) => { },
        fillStyle: 0,
        fillRect: (...args) => { },
        font: 0,
        fillText: (...args) => { },
    }
    mock_cnv = [{
        getContext: (...args) => { return mock_ctx; },
    }]
    mock_cnv.width = () => { return 0 };
    mock_cnv.height = () => { return 0 };

    let clock = new Clock(mock_cnv);
    expected = 1000;
    clock.setTime(expected);
    clock.draw_clock();
}

function test_init_clock_with_string_or_int_time() {
    let clock = new Clock(undefined, 15);
    expected = 15;
    assertEqual(clock.time, expected);

    clock = new Clock(undefined, '0:00:01.5');
    expected = 15;
    assertEqual(clock.time, expected);
}

function main() {
    test_parseTime_converts_time_to_integer();
    test_timeToStr_converts_integer_time_to_display_string();
    test_setTime_sets_the_time_w_string_or_int_time();
    test_init_clock_with_string_or_int_time();
    test_drawClock_uses_the_objects_time();
    console.log('All tests pass.');
}

main();
