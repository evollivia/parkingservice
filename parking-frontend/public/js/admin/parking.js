// 페이지 로드시 자동으로 실행
window.addEventListener('load', async () => {
    try {
        const parkseat = await getParkseatList();
        const availableSpots = await getAvailableSpots();
        displayParkseatList(parkseat);
        displayAvailableSpots(availableSpots);
    } catch (e) {
        console.error('차량 목록 조회 실패:', e); // 에러 로그 출력
        alert('차량 목록 조회 실패!'); // 사용자에게 알림
    }
});

const getParkseatList = async () => {
    let url = 'http://127.0.0.1:8002/parkseat';
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 fetch 실패!');
    }
};


const displayParkseatList = (parkseat) => {

    const parkseatlist = document.querySelector('#parkseat-list');
    console.log(parkseat);

    let html = '<ul>';
    for (const ps of parkseat) {
        html += `<li>
            차량번호 : ${ps.carnum},
            장애여부 : ${ps.barrier}
            [<a href="javascript:premove('${ps.id}')">출차</a>]
        </li>`
    }
    html += '</ul>';

    parkseatlist.innerHTML = html;
};

// 남은 자리 수 가져오기
const getAvailableSpots = async () => {
    let url = 'http://127.0.0.1:8002/available-spots';
    const res = await fetch(url);

    if (res.ok) {
        const data = await res.json();
        return {
            total_available_spots: data.total_available_spots || 0,
            disabled_spots_left: data.disabled_spots_left || 0,
            non_disabled_spots_left: data.non_disabled_spots_left || 0
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
    const availableDisabledSpots = availableSpots?.disabled_spots_left ?? 0;
    const availableRegularSpots = availableSpots?.non_disabled_spots_left ?? 0;

    // HTML에 남은 자리 수 업데이트
    availableSpotsElement.innerText = `남은 전체 자리 수: ${availableTotalSpots} / 100\n남은 장애인 자리 수: ${availableDisabledSpots} / 3\n남은 일반 자리 수: ${availableRegularSpots} / 97`;
};


const premove = async (id) => {
    if (!confirm('정말로 출차 하시겠습니까?')) return;

    let url = `http://127.0.0.1:8002/parkseat/${id}`;
    const res = await fetch(url, { method: 'DELETE' });

    if (res.ok) {
        // 출차 성공 시 남은 자리 수 업데이트
        const availableSpots = await getAvailableSpots(); // 남은 자리 수를 가져옴

        // 가져온 남은 자리 수를 0으로 초기화하여 undefined 처리
        availableSpots.available_spots = availableSpots.available_spots || 0;
        availableSpots.available_disabled_spots = availableSpots.available_disabled_spots || 0;
        availableSpots.available_regular_spots = availableSpots.available_regular_spots || 0;

        displayAvailableSpots(availableSpots); // 화면에 남은 자리 수를 표시

        alert('출차 되었습니다');
        location.href = '/parkseat'; // 페이지 리다이렉션
    } else {
        alert('출차 실패!'); // 에러 처리
    }
};

const totalSpots = 100; // 총 주차 자리 수
const parkingSpotsContainer = document.getElementById("parking-spots");

//api로 이미 이용중인 차량 수 가져오기
const usedSpots = 10

// 사용된 자리 인덱스를 저장할 배열
const usedIndices = new Set();

// 랜덤한 인덱스 생성 (중복되지 않도록)
while (usedIndices.size < usedSpots) {
    const randomIndex = Math.floor(Math.random() * totalSpots);
    usedIndices.add(randomIndex);
}

// 사각형 생성
for (let i = 0; i < totalSpots; i++) {
    const spot = document.createElement("div");
    spot.className = "parking-spot";

    // 사용된 자리일 경우 색상 변경
    if (usedIndices.has(i)) {
        spot.style.backgroundColor = "#ff6347"; // 사용 중 (예: 빨간색)
    } else {
        spot.style.backgroundColor = "#32cd32"; // 사용 가능 (예: 초록색)
    }

    parkingSpotsContainer.appendChild(spot);
}
