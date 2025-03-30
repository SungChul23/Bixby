export default function openAppAction(input) {
  return {
    uri: 'kkampak://open'
  };
}
//저희가 자체 제작한 "깜빡" 이라는 앱을 연결 시켜주는 기능입니다.
//"깜빡"에서도 기기제어, 기기상태확인, 그룹 리스트 생성 및 제어 그리고 가전기기 별 전기량 시각화
//마지막으로 AI가 전력량에 대한 조언을 끝으로 AIoT생태계를 구현했습니다.