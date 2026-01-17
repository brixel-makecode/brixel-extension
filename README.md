# LCD1602 I2C 확장

이 확장은 I2C 인터페이스를 사용하는 1602 (16x2 문자) LCD 모듈을 제어할 수 있게 해줍니다.

## 사용법

### 초기화
가장 먼저 LCD를 초기화해야 합니다. I2C 주소는 보통 `39` (0x27) 또는 `63` (0x3F)입니다.
```blocks
LCD1602.init(39)
```

### 문자열 출력
```blocks
LCD1602.showString("Hello")
```

### 커서 이동
원하는 위치에 글자를 쓰기 위해 커서를 이동합니다.
```blocks
LCD1602.setCursor(0, 1) // 1번째 칸, 2번째 줄
LCD1602.showString("World!")
```

### 화면 지우기
```blocks
LCD1602.clear()
```

## 배선

| 마이크로비트 | LCD |
|------------|-----|
| 3V | VCC |
| GND | GND |
| P19 (SCL) | SCL |
| P20 (SDA) | SDA |

## 라이선스
MIT
