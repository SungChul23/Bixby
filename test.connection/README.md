<!-- # New Capsule

Welcome to your New Capsule!

## Creating your Capsule

Learn about creating your capsule by following the [Quick Start Guide](https://bixbydevelopers.com/dev/docs/get-started/quick-start).

## Submitting Your Capsule to the Marketplace

Learn about submitting your capsule to the [Marketplace](https://bixbydevelopers.com/dev/docs/dev-guide/developers/deploying.can-submission#about-the-marketplace).

---

## Additional Resources

### Your Source for Everything Bixby

* [Bixby Developer Center](https://bixbydevelopers.com) - Everything you need to get started with Bixby development!

### Guides & Best Practices

* [Quick Start Guide](https://bixbydevelopers.com/dev/docs/get-started/quick-start) - Build your first capsule!
* [Design Guides](https://bixbydevelopers.com/dev/docs/dev-guide/design-guides) - Best practices for designing your capsules.
* [Developer Guides](https://bixbydevelopers.com/dev/docs/dev-guide/developers) - Guides that take you from design and modeling all the way through deployment of your capsules.

### Video Guides

* [Hello World Tutorial](https://youtu.be/3fu9ecnlS5A) - A super quick video introduction to creating a working capsule.
* [Playlist of Bixby Studio Tutorials](https://www.youtube.com/playlist?list=PLE9wDcpAxXg9VU7L5B3Scw6aH3v35c-op) - Watch tutorials from our Bixby team on how to use Bixby Studio and get the most out of all its features!

### Need Support?

* Have a feature request? Please suggest it in our [Support Community](https://support.bixbydevelopers.com/hc/en-us/community/topics/360000183273-Feature-Requests) to help us prioritize.
* Have a technical question? Ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/bixby) with tag “bixby”. -->

0. Access Token과 Refresh Token 저장 방식 
1. 네이버 카카오톡 삼성계정 API 키를 가져와 테스트 해보기
2. 로그인 창 생성 후 로그인 완료 후 계정과 회원이 가지고 있는 Iot 플러그 매핑 (중요)
3. [주요로직] 서버에서 회원과 회원이 가지고 있는 플러그 Id를 매핑 해야함(그럼 회원 DB랑 플러그 Id랑 조인해야함)
4. 결과 못찼을 때는 "해당 결과 존재하지 않아요"
//https://github.com/starjoon/Bixby_Master_Corona/blob/master/models/actions/GetPatients.model.bxb

5. 내가 오어뜨 인증 서버에 요청을 하고 토큰을 발급 받고 이걸 AWS 서버랑 대조후에 맞으면 자원제공 ? ㄱㅊ나
6. URL 앞에 oauth 단어 하나 추가해서 요청을 보낸다면 헤더에 토큰 전달 그럼 서버에서 이걸 확인해서 올바른 토큰 값이구나


18.219.154.73
52.15.218.90
18.188.238.231

Bixby 서버 IP 범위(AWS IP 대역)를 파악해서 CIDR로 넣는 방법 (ex: 18.0.0.0/8)