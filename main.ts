const direction_left = 0;
const direction_front = 1;
const direction_right = 2;
function show_face(direction: number): void {
    switch (direction) {
        case 0:
            basic.showLeds(`
                # . . # .
                . . . . .
                # . # . #
                . # . # .
                . . . . .
            `, 0);
            break;
        case 1:
            basic.showLeds(`
                # . . . #
                . . . . .
                # . # . #
                . # . # .
                . . . . .
            `, 0);
            break;
        case 2:
            basic.showLeds(`
                . # . . #
                . . . . .
                # . # . #
                . # . # .
                . . . . .
            `, 0);
            break;
    }
}
function show_any_face(): void {
    show_face(randint(0, 2));
}

const phrases = ["Hello world!", "I am a robot.", "Hello."];
let last_phrase_index: number = null;
control.setInterval(() => {
    if (busy) return;

    let phrase_index = randint(0, phrases.length - 1);
    // Make sure we get a new phrase each time.
    // Don't use a loop for this as it might never finish.
    if (phrase_index === last_phrase_index) {
        if (phrase_index === phrases.length - 1) {
            phrase_index -= 1;
        } else {
            phrase_index += 1;
        }
    }
    last_phrase_index = phrase_index;

    const phrase = phrases[phrase_index];

    // Showing the first character separately gives the user more time to pay attention to the string that is about to be shown.
    if (busy) return;
    basic.showString(phrase[0], 100);
    if (busy) return;
    basic.showString(phrase.slice(1), 125);
    if (busy) return;

    show_any_face();
}, 5000, control.IntervalMode.Interval);

let busy = false;
let busy_timeout: number;
// Prevents the robot from going idle for this long.
function set_busy_for(milliseconds: number): void {
    busy = true;
    control.clearInterval(busy_timeout, control.IntervalMode.Timeout);
    busy_timeout = control.setInterval(() => {
        busy = false;
    }, milliseconds, control.IntervalMode.Timeout);
}

const save_power = false;

if (save_power) {
    // 2 is the lowest brightness. Anything lower turns off the lights.
    led.setBrightness(2);
} else {
    led.setBrightness(0xff);
}
bluetooth.startUartService();
show_any_face();

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes);
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No);
})

const delimiter = serial.delimiters(Delimiters.Fullstop);
bluetooth.onUartDataReceived(delimiter, () => {
    set_busy_for(10000);
    const char = bluetooth.uartReadUntil(delimiter);
    basic.showString(char, 0);
});

input.onButtonPressed(Button.A, function () {
    set_busy_for(5000);
    show_face(direction_left);
});
input.onButtonPressed(Button.AB, function () {
    set_busy_for(5000);
    show_face(direction_front);
});
input.onButtonPressed(Button.B, function () {
    set_busy_for(5000);
    show_face(direction_right);
});
input.onLogoEvent(TouchButtonEvent.Pressed, function() {
    set_busy_for(5000);
    while (true) {
        basic.showLeds(`
            . . . . .
            . . . . .
            # . # . #
            . . . . .
            . . . . .
        `);
        if (!busy) return;
        basic.showLeds(`
            . . . . .
            . . . . .
            . # . # .
            . . . . .
            . . . . .
        `);
        if (!busy) return;
        if (input.buttonIsPressed(Button.A)) {

        } else if (input.buttonIsPressed(Button.B)) {

        }
    }
});

input.onGesture(Gesture.FreeFall, function() {
})
