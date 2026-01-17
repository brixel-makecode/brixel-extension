/**
 * TM1637 FND Display
 */

//% weight=90 color=#D400D4 icon="\uf0e7"
//% category="A.Display"
//% subcategory="FND"
namespace TM1637 {
    /**
     * TM1637 초기화
     */
    //% block="FND 초기화 CLK %clk DIO %dio"
    export function init(clk: DigitalPin, dio: DigitalPin): void {
        // Placeholder implementation
    }

    /**
     * 숫자 표시
     */
    //% block="FND 숫자 표시 %num"
    export function showNumber(num: number): void {
        // Placeholder implementation
    }
}
