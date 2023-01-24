# 모니터링, ELK 로깅, 성능 테스트 예제

## 실행 방법

```shell
$ docker compose up --build 
```

## K6 성능 테스트

*사전에 K6 설치가 필요합니다.* [설치 방법](https://k6.io/docs/getting-started/installation/)

### 부하 테스트 실행
```shell
$ k6 run --vus 100 --duration 30s script.js
```
- 동시에 100명의 가상 유저가 30초 동안 `script.js`에 정의된 요청을 반복합니다. 
- 요청 스크립트 작성 방법은 [해당 링크](https://k6.io/docs/using-k6/http-requests/)를 참고바랍니다. 

### 결과 예시
```shell
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: script.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 1m30s max duration (incl. graceful stop):
           * default: 100 looping VUs for 1m0s (gracefulStop: 30s)


running (1m14.7s), 000/100 VUs, 433 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  1m0s

     data_received..................: 188 kB 2.5 kB/s
     data_sent......................: 42 kB  568 B/s
     http_req_blocked...............: avg=821.28µs min=2µs    med=7µs   max=4.44ms  p(90)=3.74ms p(95)=4ms    
     http_req_connecting............: avg=619.22µs min=0s     med=0s    max=3.18ms  p(90)=2.78ms p(95)=2.9ms  
     http_req_duration..............: avg=5.55s    min=1.66s  med=4.4s  max=19.52s  p(90)=10.56s p(95)=13.56s 
       { expected_response:true }...: avg=5.55s    min=1.66s  med=4.4s  max=19.52s  p(90)=10.56s p(95)=13.56s 
     http_req_failed................: 0.00%  ✓ 0        ✗ 433  
     http_req_receiving.............: avg=956.09µs min=20µs   med=113µs max=55.31ms p(90)=2.51ms p(95)=4.06ms 
     http_req_sending...............: avg=29.2µs   min=8µs    med=26µs  max=641µs   p(90)=44µs   p(95)=54.79µs
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s    max=0s      p(90)=0s     p(95)=0s     
     http_req_waiting...............: avg=5.55s    min=1.66s  med=4.4s  max=19.51s  p(90)=10.56s p(95)=13.56s 
     http_reqs......................: 433    5.800112/s
     iteration_duration.............: avg=15.55s   min=11.66s med=14.4s max=29.52s  p(90)=20.56s p(95)=23.56s 
     iterations.....................: 433    5.800112/s
     vus............................: 3      min=3      max=100
     vus_max........................: 100    min=100    max=100
```
- `http_req_duration` 항목에서 요청이 처리되는지 얼마나 걸렸는지 표시됩니다.
- `p(x)`에 해당하는 값은 전체 중 x% 요청이 해당 값 이내로 동작함을 나타냅니다.
- 자세한 결과 해석은 [해당 링크](https://k6.io/docs/using-k6/metrics/)를 참고 바랍니다.
- ##### [K6 공식 문서](https://k6.io/docs/)

## Prometheus, Grafana 모니터링
### 접속 방법
- `http://localhost:9090` : Prometheus - 모니터링 시스템
- `http://localhost:3001` : Grafana - 시계열 메트릭 데이터 시각화 
- `http://localhost:8080` : cAdvisor - 컨테이너 메트릭 수집
- `http://localhost:9100` : Node Exporter - 호스트 메트릭 수집

### Grafana 데이터 소스 등록 방법

1. 좌측 메뉴에서 톱니바퀴 모양의 `Configuration` 에서 `Data Source`클릭
2. 파란색 `Add Data source` 버튼 클릭
3. Prometheus 선택
4. URL 입력 칸에 [`http://prometheus:9090`](http://prometheus:9090/) 입력
5. 화면을 아래로 내린 후 파란색 `Save & Test` 클릭
6. `Datasource updated` 라는 초록색 알림이 뜨면 완료
    - 만약 데이터 소스가 등록이 되지 않는다면 Prometheus 컨테이너가 동작 중인지 확인

### 대시 보드 불러오는 방법

1. 좌츨 메뉴에서 십자가 모양의 `Create` 에서 `import` 클릭
2. `Import via grafana.com` 아래의 입력 칸에 [Grafana.com](http://Grafana.com) 에서 검색한 대시 보드 ID를 입력 후 파란색 `Load` 버튼 클릭
    - 예시 [https://grafana.com/grafana/dashboards/6756](https://grafana.com/grafana/dashboards/6756) 의 `6756`
3. 맨 아래 입력창에서 datasource 선택 후 파란색 `import` 버튼 클릭

### 대시 보드 생성하는 방법

1. 좌츨 메뉴에서 십자가 모양의 `Create` 클릭
2. `add a new panel` 클릭
3. `Data source` 에서 등록한 데이터 소스 선택
4. `metric browser` 를 클릭하여 확장
5. `1. Select a metric` 에서 표시할 메트릭 선택
6. 추가 옵션을 넣지 않는다면 아래의 파란색 `Use Query` 클릭
    - 옵션을 넣는 방법
        1. `2. Select labels to search in` 에서 표시할 라벨 선택
        2. `3. Select (multiple) values for your labels` 에서 라벨 세부 선택
7. 좌측 상단의 파란색 `Apply` 버튼 클릭
8. 대시보드에서 우측 상단 아이콘 중 맨 왼쪽 `Add panel` 을 클릭하여 대시보드에 패널 추가 가능
9. 대시보드에서 우측 상단 아이콘 중 디스크 모양의 `Save dashboard` 클릭하여 대시보드 변경 사항 저장

### 등록한 대시 보드 찾는 방법

1. 좌측 메뉴에서 4개의 사각형으로 구성된 `Dashboards` 에서 `Browse` 클릭

- ##### [Grafana Demo](https://play.grafana.org/)
- ##### [Django Prometheus 설정 방법](https://github.com/korfuri/django-prometheus)

## ELK 로깅
### 동작 방식
1. NGINX의 로그파일을 Filebeat로 수집
2. 수집한 로그를 Logstash에 전달
3. 전달 받은 로그를 Elasticsearch에 저장
4. 저장된 로그를 Kibana를 통해 분석

### Kibana를 사용 방법

1. `http://localhost:5601` 접속
2. 상단 메뉴에서 `index management` 검색
3. 수집된 로그 인덱스 확인 `stress-logs-yyyy.MM.dd` 형식
4. 좌측 메뉴의 `Analytics`의 `Dashboard` 클릭
5. `Create data view`를 통해 인덱스 선택
   - 전체 조회 : `Index Pattern`에 `stress-logs-*` 입력 및 저장 
   - 선택 조회 : `Index Pattern`에 보고싶은 날짜입력 (eg. `weblogs-2023.01.01`)
6. `Create Visualization` 클릭
7. 보고 싶은 필드를 화면에 드롭다운 하여 시각화

- ###### [Kibana Demo](https://demo.elastic.co/app/dashboards#/view/1be3aae0-9406-11e8-8fa2-3d5f811fbd0f?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))

## 서버 구성
엔드포인트 `http://localhost/api/v1/multi`

파라미터 `x` `y` 정수 값 => x * y 횟수 만큼 반복문이 동작

예시 `http://localhost/api/v1/multi?x=100&y=100`


