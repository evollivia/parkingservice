// 현재 URL의 경로 가져오기
const path = window.location.pathname;

// 경로를 슬래시로 분리
const pathSegments = path.split('/');

// 마지막 값을 가져오기 (배열의 마지막 요소)
const lastSegment = pathSegments[pathSegments.length - 1];

// 마지막 값을 디코딩
const carnum = decodeURIComponent(lastSegment);

// console.log(`마지막 값: ${carnum}`);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const payment = await paylist();
        displayPayment(payment);
    } catch(e) {
        console.log(e);
        alert('정산내역 조회 실패!');
    }
})

const paylist = async () => {
    // let url = `http://127.0.0.1:8000/payment?carnum=${carnum}`;
    // const res = await fetch(url);
    // if (res.ok) {
    //     const data = await res.json();
    //     return data;
    // } else {
    //     throw new Error('차량 목록 조회 실패!!');
    // }
    const dummyData = [
        {
            carnum: '12 가 1234',
            intime: '2024-10-01 10:00',
            outtime: '2024-10-01 12:00',
            parkingDuration: '2시간',
            fee: '5,000원'
        }
    ];
    return dummyData;
}

const displayPayment = (payment) => {
    const paytbody = document.querySelector('#paytbody');

    let html = `
        <tr>
            <th>차량 번호</th>
            <td id="carLicense">${carnum}</td>
        </tr>
        <tr>
            <th>입차 시간</th>
            <td id="entryTime">${payment[0].intime}</td>
        </tr>
        <tr>
            <th>출차 시간</th>
            <td id="exitTime">${payment[0].outtime}</td>
        </tr>
        <tr>
            <th>주차 시간</th>
            <td id="parkingDuration">${payment[0].parkingDuration}</td>
        </tr>
        <tr>
            <th>요금 확인</th>
            <td id="fee">${payment[0].fee}</td>
        </tr>
    `
    paytbody.innerHTML = html;
}

