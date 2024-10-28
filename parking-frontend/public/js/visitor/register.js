window.addEventListener('load', async () => {
    try {
        const availableSpots = await getAvailableSpots();
        displayAvailableSpots(availableSpots);
    } catch (e) {
        console.error('차량 목록 조회 실패:', e); // 에러 로그 출력
        alert('차량 목록 조회 실패!'); // 사용자에게 알림
    }
});

// 남은 자리 수 가져오기
const getAvailableSpots = async () => {
    let url = 'http://127.0.0.1:8002/available-spots';
    const res = await fetch(url);

    if (res.ok) {
        const data = await res.json();
        return {
            total_available_spots: data.total_available_spots || 0,
        };
    } else {
        throw new Error('남은 자리 수 fetch 실패!');
    }
};

// 남은 자리 수 표시
const displayAvailableSpots = (availableSpots) => {
    const availableSpotsElement = document.querySelector('#available-spots');

    // availableSpots가 undefined일 경우 기본값으로 초기화
    const availableTotalSpots = availableSpots?.total_available_spots ?? 0;

    // HTML에 남은 자리 수 업데이트
    availableSpotsElement.innerText = `남은 전체 자리 수: ${availableTotalSpots} / 100`;
};
// 차량 등록
const regbtn = document.querySelector('#regbtn');
const vehiclefrm = document.vehiclefrm;


// 비동기 처리 구현 - async, await
regbtn.addEventListener('click', async () => {
    const formData = new FormData(vehiclefrm);

    let jsondata = {};
    formData.forEach((val, key) => {
        jsondata[key] = val;
    });

    // barrier 값을 O/X로 처리
    const barrier = formData.get('barrier');
    jsondata.barrier = barrier === 'true';

    // 현재 UTC 시간을 가져와 KST로 변환
    const nowUTC = new Date(); // 현재 UTC 시간
    const nowKST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000)); // UTC에 9시간 추가
    jsondata.intime = nowKST.toISOString(); // ISO 형식의 문자열로 설정

    // 출차 시간은 자동으로 빈 값을 설정
    jsondata.outtime = null;

    const carnumPattern = /^(?:\d{2}[가-힣]\d{4}|\d{3}[가-힣]\d{4})$/;
    if (!carnumPattern.test(jsondata.carnum)) {
        alert('차량 번호는 "23가4567" 또는 "456마4534" 형식으로 입력해 주세요.');
        return; // 요청 전송을 중단
    }

    // 유효성 검사
    if (!jsondata.carnum || jsondata.barrier === undefined) {
        alert('모든 필드를 올바르게 입력해 주세요.');
        return; // 요청 전송을 중단
    }

    console.log(jsondata);

    const res = await fetch('http://127.0.0.1:8002/vehicle',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsondata)
        })
        .then((resp) => resp.json()) // 서버로의 응답 처리
        .then((data) => {
            alert('차량 등록 성공!!');
            console.log(data.pno, data.carnum, data.intime);
        }).catch((error) => {
            alert('차량 등록 실패!!');
            console.log(error);
        });
});