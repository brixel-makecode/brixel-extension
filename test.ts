/**
 * LCD1602 테스트 코드
 */

// LCD 초기화 (주소 0x27)
LCD1602.init(39);

// 백라이트 켜기
LCD1602.backlight();

// 첫 번째 줄 출력
LCD1602.setCursor(0, 0);
LCD1602.showString("Hello micro:bit!");

// 두 번째 줄 출력
LCD1602.setCursor(0, 1);
LCD1602.showString("LCD1602 Test");

// 2초 대기
basic.pause(2000);

// 화면 지우기
LCD1602.clear();

// 숫자 카운트 테스트
for (let i = 0; i <= 10; i++) {
    LCD1602.setCursor(0, 0);
    LCD1602.showString("Count: ");
    LCD1602.showNumber(i);
    basic.pause(500);
}

LCD1602.clear();
LCD1602.showString("Done!");
