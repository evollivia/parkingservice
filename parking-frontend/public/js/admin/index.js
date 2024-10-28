window.addEventListener('load', async () => {
    try {
        const cars = await visitedCars();
        displayCarList(cars);
    } catch (e) {
        console.log(e);
        alert('방문차량 목록 조회 실패!');
    }
})

const visitedCars = async () => {
    let url = 'http://127.0.0.1:8002/vehicles';
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 fetch 실패!');
    }
}

const displayCarList = (cars) => {
    const visitedtbody = document.querySelector('#vehicle-list');
    console.log(cars);

    let html = '';
    for ( const car of cars) {
        html += `
        <tr class="text-center">
            <td>${car.carnum}</td>
            <td>${car.intime}</td>
            <td>${car.outtime}</td>
        </tr>
        `
    }
    visitedtbody.innerHTML = html;
}