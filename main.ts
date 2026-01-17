/**
 * Brixel 입출력장치 통합 MakeCode 확장
 * 테스트 버전: 01~10 카테고리 구조 + LCD1602 블록
 */

// ============================================================
// 01. 디스플레이 (Display)
// ============================================================

/**
 * LCD1602 I2C 문자 디스플레이
 */
//% weight=100 color="#0fbc11" icon="\uf26c"
//% block="LCD1602"
//% groups=['설정', '출력', '제어']
//% category="01.디스플레이"
//% subcategory="LCD1602"
namespace LCD1602 {
    let _i2cAddr = 0x27;
    let _bklight = 8;
    const LCD_CLEARDISPLAY = 0x01;
    const LCD_SETDDRAMADDR = 0x80;
    const LCD_BACKLIGHT = 0x08;
    const LCD_NOBACKLIGHT = 0x00;

    function i2cWrite(data: number): void {
        pins.i2cWriteNumber(_i2cAddr, data, NumberFormat.UInt8BE, false);
    }

    function expanderWrite(data: number): void {
        i2cWrite(data | _bklight);
    }

    function pulseEnable(data: number): void {
        let _en = 4;
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
        send(value, 1);
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
        basic.pause(50);
        expanderWrite(_bklight);
        basic.pause(1000);
        write4bits(0x03 << 4);
        control.waitMicros(4500);
        write4bits(0x03 << 4);
        control.waitMicros(4500);
        write4bits(0x03 << 4);
        control.waitMicros(150);
        write4bits(0x02 << 4);
        command(0x20 | 0x00 | 0x08 | 0x00);
        command(0x08 | 0x04 | 0x00 | 0x00);
        clear();
        command(0x04 | 0x02 | 0x00);
    }

    /**
     * 화면을 지웁니다.
     */
    //% block="LCD 화면 지우기"
    //% group="제어"
    //% weight=90
    export function clear(): void {
        command(LCD_CLEARDISPLAY);
        basic.pause(2);
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
}

// ============================================================
// 02. 고급디스플레이 (Advanced Display) - 추후 추가 예정
// ============================================================

//% weight=99 color="#F1C40F" icon="\uf108"
//% category="02.고급디스플레이"
namespace AdvDisplay {
    // 추후 OLED, TFT 등 추가
}

// ============================================================
// 03. 센서 (Sensors) - 추후 추가 예정
// ============================================================

//% weight=98 color="#3498DB" icon="\uf2c9"
//% category="03.센서"
namespace Sensors {
    // 추후 DHT11, 초음파 등 추가
}

// ============================================================
// 04. 고급센서 (Advanced Sensors) - 추후 추가 예정
// ============================================================

//% weight=97 color="#8E44AD" icon="\uf11b"
//% category="04.고급센서"
namespace AdvSensors {
    // 추후 조이스틱, RTC 등 추가
}

// ============================================================
// 05. 모터 (Motors) - 추후 추가 예정
// ============================================================

//% weight=96 color="#E74C3C" icon="\uf013"
//% category="05.모터"
namespace Motors {
    // 추후 서보, DC모터 등 추가
}

// ============================================================
// 06. 출력장치 (Outputs) - 추후 추가 예정
// ============================================================

//% weight=95 color="#F1C40F" icon="\uf0a1"
//% category="06.출력장치"
namespace Outputs {
    // 추후 부저, 릴레이 등 추가
}

// ============================================================
// 07. 통신 (Communication) - 추후 추가 예정
// ============================================================

//% weight=94 color="#8E44AD" icon="\uf1eb"
//% category="07.통신"
namespace Communication {
    // 추후 IR, RFID 등 추가
}

// ============================================================
// 08. 시리얼 (Serial) - 추후 추가 예정
// ============================================================

//% weight=93 color="#27AE60" icon="\uf0ec"
//% category="08.시리얼"
namespace SerialComm {
    // 추후 UART 등 추가
}

// ============================================================
// 09. 블루투스 (Bluetooth) - 추후 추가 예정
// ============================================================

//% weight=92 color="#0D47A1" icon="\uf294"
//% category="09.블루투스"
namespace BluetoothComm {
    // 추후 HC-05/06, BLE 등 추가
}

// ============================================================
// 10. WiFi - 추후 추가 예정
// ============================================================

//% weight=91 color="#00BCD4" icon="\uf1eb"
//% category="10.WiFi"
namespace WiFiComm {
    // 추후 ESP8266, ESP32 등 추가
}
