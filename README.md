# Setup

1. Get a micro:bit: <https://microbit.org>.
2. Get a MiniBit: <https://4tronix.co.uk/blog/?p=2068>.
3. Get a type A male to micro type B male USB cable.
4. Get 3 AA Alkaline batteries. The micro:bit cannot power the MiniBit's wheels or LEDs.
5. Follow <https://support.microbit.org/support/solutions/articles/19000105428-webusb-troubleshooting> for your platform if there is no disk drive called MICROBIT showing up when you connect the micro:bit to your computer via USB.
6. Update the micro:bit's firmware: <https://microbit.org/get-started/user-guide/firmware/>.
7. Pair the micro:bit with your computer via Bluetooth:
  1. Hold down the A, B, and reset buttons simultaneously.
  2. Release the reset button but still hold the A and B buttons.
  3. The LED matrix should fill and you should see the Bluetooth logo.
  4. Go into your computer's Bluetooth settings and pair your computer with your micro:bit.
8. In MakeCode:
  1. Copy-paste the content of this repository's `main.ts/`.
  2. In settings, turn on Bluetooth for anyone (no pairing required).
  3. Flash the `.hex` file.

If you want to be able to control the robot from your phone, get the app microbitBLE by ayama: <https://apps.apple.com/us/app/microbitble/id1635024315>.
It's one of the few apps that I was consistently able to connect to my micro:bit with.

# Troubleshooting

If you're getting error code 504 (timeout), just keep trying and reconnecting the micro:bit to your computer.

# Use a low-level language like Zig, C/C++, or Rust?

Nope, this time in this project I'm saving myself from all this headache and just doing it the easy way and having fun by doing it like everyone else: Microsoft MakeCode with blocks, JavaScript, or Python (JavaScript for this project).

The micro:bit runtime (<https://lancaster-university.github.io/microbit-docs/>) similarly comes with its own difficulties.
 
