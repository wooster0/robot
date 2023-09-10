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

function set_screen_brightness(): void {
    if (save_power) {
        // 2 is the lowest brightness. Anything lower turns off the lights.
        led.setBrightness(2);
    } else {
        led.setBrightness(0xff);
    }
}

function apply_sound_volume(): void {
    music.setVolume(((sound_volume / 10) * 2) * 0xff);
}

function show_volume(): void {
    for (let x = 0; x <= 4; x += 1)
        led.plotBrightness(x, 2, 2)
    led.plotBrightness(sound_volume, 2, 0xff)
}

let sound_volume = 4;
apply_sound_volume();

led.setDisplayMode(DisplayMode.BlackAndWhite)
set_screen_brightness();
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

let adjust_sound_volume = false;
input.onButtonPressed(Button.A, function () {
    if (!busy) {
        menu = false;
        adjust_sound_volume = false;
    }
    if (menu) {
        set_busy_for(5000);
        if (adjust_sound_volume) {
            if (sound_volume !== 0)
                sound_volume -= 1;
        } else {
            adjust_sound_volume = true;
        }
        show_volume();
        apply_sound_volume();
        music.playTone(Note.C, 100);

        return;
    }

    set_busy_for(5000);
    show_face(direction_left);
});
input.onButtonPressed(Button.AB, function () {
    if (!busy) {
        menu = false;
        adjust_sound_volume = false;
    }
    if (menu) {
        set_busy_for(5000);
        return;
    }

    set_busy_for(5000);
    show_face(direction_front);

    busy = true;
    basic.clearScreen();
    let offset = -4;
    while (offset <= 4) {
        for (let y = 0; y <= 4; y += 1) {
            for (let x = 0; x <= 4; x += 1) {
                led.plotBrightness(x, offset + y, ((4 - y) * 63) + 3);
            }
            const notes = [Note.A, Note.B, Note.C, Note.D, Note.E, Note.F, Note.G, Note.CSharp3];
            if (offset == 3 && sound_volume !== 0) music.setVolume(0xff);
            music.playTone(notes[offset + 4], 10)
            if (offset == 3 && sound_volume !== 0) apply_sound_volume();
        }
        offset += 1;
        control.waitMicros(100000);
    }
    basic.clearScreen();
    busy = false;
});
input.onButtonPressed(Button.B, function () {
    if (!busy) {
        menu = false;
        adjust_sound_volume = false;
    }
    if (menu) {
        set_busy_for(5000);
        if (adjust_sound_volume) {
            if (sound_volume !== 4)
                sound_volume += 1;
            show_volume();
            apply_sound_volume();
            music.playTone(Note.A, 100);
        }
        return;
    }

    set_busy_for(5000);
    show_face(direction_right);
});

let menu = false;
input.onLogoEvent(TouchButtonEvent.Pressed, function() {
    menu = !menu;
    if (menu) {
        set_busy_for(5000);
        // "Awaiting input..."
        basic.showLeds(`
            . . . . .
            . . . . .
            # . # . #
            . . . . .
            . . . . .
        `);
    }
});

input.onGesture(Gesture.FreeFall, function() {
    music.playMelody("A D E G A B", 20);
})
