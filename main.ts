/**
 * LCD1602 I2C Display Extension for MakeCode
 * Ported from Arduino LiquidCrystal_I2C library
 */


//% weight=100 color="#0fbc11" icon="\uf26c"
//% block="LCD1602"
//% groups=['설정', '출력', '제어']
//% category="A_display"
//% subcategory="LCD1602"
namespace LCD1602 {
    let _i2cAddr = 0x27;
    let _bklight = 8; // Backlight on by default (0x08)
    let _rs = 1;      // Register select bit
    let _rw = 2;      // Read/Write bit
    let _en = 4;      // Enable bit

    // Commands
    const LCD_CLEARDISPLAY = 0x01;
    const LCD_RETURNHOME = 0x02;
    const LCD_ENTRYMODESET = 0x04;
    const LCD_DISPLAYCONTROL = 0x08;
    const LCD_CURSORSHIFT = 0x10;
    const LCD_FUNCTIONSET = 0x20;
    const LCD_SETCGRAMADDR = 0x40;
    const LCD_SETDDRAMADDR = 0x80;

    // Flags for display entry mode
    const LCD_ENTRYRIGHT = 0x00;
    const LCD_ENTRYLEFT = 0x02;
    const LCD_ENTRYSHIFTINCREMENT = 0x01;
    const LCD_ENTRYSHIFTDECREMENT = 0x00;

    // Flags for display on/off control
    const LCD_DISPLAYON = 0x04;
    const LCD_DISPLAYOFF = 0x00;
    const LCD_CURSORON = 0x02;
    const LCD_CURSOROFF = 0x00;
    const LCD_BLINKON = 0x01;
    const LCD_BLINKOFF = 0x00;

    // Flags for display/cursor shift
    const LCD_DISPLAYMOVE = 0x08;
    const LCD_CURSORMOVE = 0x00;
    const LCD_MOVERIGHT = 0x04;
    const LCD_MOVELEFT = 0x00;

    // Flags for function set
    const LCD_8BITMODE = 0x10;
    const LCD_4BITMODE = 0x00;
    const LCD_2LINE = 0x08;
    const LCD_1LINE = 0x00;
    const LCD_5x10DOTS = 0x04;
    const LCD_5x8DOTS = 0x00;

    // Flags for backlight control
    const LCD_BACKLIGHT = 0x08;
    const LCD_NOBACKLIGHT = 0x00;

    function i2cWrite(data: number): void {
        pins.i2cWriteNumber(_i2cAddr, data, NumberFormat.UInt8BE, false);
    }

    function expanderWrite(data: number): void {
        i2cWrite(data | _bklight);
    }

    function pulseEnable(data: number): void {
        expanderWrite(data | _en);
        control.waitMicros(1);
        expanderWrite(data & ~_en);
        control.waitMicros(50);
    }

    function write4bits(data: number): void {
        expanderWrite(data);
        pulseEnable(data);
    }

    function send(value: number, mode: number): void {
        let highnib = value & 0xF0;
        let lownib = (value << 4) & 0xF0;
        write4bits(highnib | mode);
        write4bits(lownib | mode);
    }

    function command(value: number): void {
        send(value, 0);
    }

    function write(value: number): void {
        send(value, _rs);
    }

    /**
     * LCD를 초기화합니다.
     * @param addr I2C 주소 (기본값: 39 (0x27))
     */
    //% block="LCD 초기화 (주소: %addr)"
    //% addr.defl=39
    //% group="설정"
    //% weight=100
    export function init(addr: number = 0x27): void {
        _i2cAddr = addr;
        _bklight = LCD_BACKLIGHT;

        // Wait for LCD to power up
        basic.pause(50);

        // Initialization sequence
        expanderWrite(_bklight);
        basic.pause(1000);

        // Try to set 4-bit mode (3 times)
        write4bits(0x03 << 4);
        control.waitMicros(4500);

        write4bits(0x03 << 4);
        control.waitMicros(4500);

        write4bits(0x03 << 4);
        control.waitMicros(150);

        // Set to 4-bit interface
        write4bits(0x02 << 4);

        // Function set: 4-bit, 2-line, 5x8 dots
        command(LCD_FUNCTIONSET | LCD_4BITMODE | LCD_2LINE | LCD_5x8DOTS);

        // Display control: Display on, Cursor off, Blink off
        command(LCD_DISPLAYCONTROL | LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF);

        // Clear display
        clear();

        // Entry mode set: Increment, No shift
        command(LCD_ENTRYMODESET | LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT);

        home();
    }

    /**
     * 화면을 지웁니다.
     */
    //% block="LCD 화면 지우기"
    //% group="제어"
    //% weight=90
    export function clear(): void {
        command(LCD_CLEARDISPLAY);
        basic.pause(2); // Clear needs more time
    }

    /**
     * 커서를 홈(0, 0) 위치로 이동합니다.
     */
    //% block="LCD 홈으로 이동"
    //% group="제어"
    //% weight=85
    export function home(): void {
        command(LCD_RETURNHOME);
        basic.pause(2); // Home needs more time
    }

    /**
     * 커서 위치를 설정합니다.
     * @param col 열 (0-15)
     * @param row 행 (0-1)
     */
    //% block="LCD 커서 이동 x: %col y: %row"
    //% group="제어"
    //% weight=80
    //% col.min=0 col.max=15
    //% row.min=0 row.max=1
    export function setCursor(col: number, row: number): void {
        let row_offsets = [0x00, 0x40, 0x14, 0x54];
        if (row > 1) row = 1;
        command(LCD_SETDDRAMADDR | (col + row_offsets[row]));
    }

    /**
     * 문자열을 출력합니다.
     * @param text 출력할 문자열
     */
    //% block="LCD 문자열 출력 %text"
    //% group="출력"
    //% weight=70
    export function showString(text: string): void {
        for (let i = 0; i < text.length; i++) {
            write(text.charCodeAt(i));
        }
    }

    /**
     * 숫자를 출력합니다.
     * @param num 출력할 숫자
     */
    //% block="LCD 숫자 출력 %num"
    //% group="출력"
    //% weight=65
    export function showNumber(num: number): void {
        showString(num.toString());
    }

    /**
     * 백라이트를 켭니다.
     */
    //% block="LCD 백라이트 켜기"
    //% group="제어"
    //% weight=60
    export function backlight(): void {
        _bklight = LCD_BACKLIGHT;
        expanderWrite(0);
    }

    /**
     * 백라이트를 끕니다.
     */
    //% block="LCD 백라이트 끄기"
    //% group="제어"
    //% weight=59
    export function noBacklight(): void {
        _bklight = LCD_NOBACKLIGHT;
        expanderWrite(0);
    }

    /**
     * 화면 표시를 켭니다.
     */
    //% block="LCD 화면 켜기"
    //% group="제어"
    //% weight=50
    export function displayOn(): void {
        command(LCD_DISPLAYCONTROL | LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF);
    }

    /**
     * 화면 표시를 끕니다.
     */
    //% block="LCD 화면 끄기"
    //% group="제어"
    //% weight=49
    export function displayOff(): void {
        command(LCD_DISPLAYCONTROL | LCD_DISPLAYOFF | LCD_CURSOROFF | LCD_BLINKOFF);
    }
}
