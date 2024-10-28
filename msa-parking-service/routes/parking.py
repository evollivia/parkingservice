from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session

from schema.parking import ParkingBase, Parking, ParkingList, ParkseatList
from service.database import get_db
from service.parking import register, vehiclelist, vehicleone, vehicledelete, parkseatlist
from models.parking import Parkseat

router = APIRouter()

# 총 자리 수와 장애인용 자리 수 상수 정의
TOTAL_SPOTS = 100
DISABLED_SPOTS = 3


@router.post('/vehicle', response_model=Parking)
async def new_vehicle(parking: ParkingBase, db: Session = Depends(get_db)):
    print(parking)

    return register(db, parking)


@router.get('/vehicle/{pno}', response_model=Optional[Parking])
async def vehicle_one(pno: int, db: Session = Depends(get_db)):
    parking = vehicleone(db, pno)

    # 상품이 조회되지 않을 경우 응답코드 404를 프론트엔드로 전달
    if parking is None:
        raise HTTPException(404, 'Vehicle not found!')

    return Parking.model_validate(parking)


@router.get('/vehicles', response_model=list[ParkingList])
async def list_vehicle(db: Session = Depends(get_db)):
    parkings = vehiclelist(db)

    return [ParkingList.model_validate(p) for p in parkings]


@router.get('/parkseat', response_model=list[ParkseatList])
async def list_parkseat(db: Session = Depends(get_db)):
    parkseat = parkseatlist(db)

    return [ParkseatList.model_validate(ps) for ps in parkseat]


@router.delete('/parkseat/{id}', response_model=int)
async def parkseat_delete(id: int, db: Session = Depends(get_db)):
    result = vehicledelete(db, id)

    return result


@router.get("/available-spots")
async def get_available_spots(db: Session = Depends(get_db)):
    # 전체 사용 중인 자리 수
    total_occupied = db.query(Parkseat).count()

    # 장애인 전용 자리 사용 중인 수
    disabled_occupied = db.query(Parkseat).filter(Parkseat.barrier == True).count()

    # 비장애인 자리 사용 중인 수
    non_disabled_occupied = total_occupied - disabled_occupied

    # 남은 자리 계산
    disabled_spots_left = DISABLED_SPOTS - disabled_occupied
    non_disabled_spots_left = (TOTAL_SPOTS - DISABLED_SPOTS) - non_disabled_occupied

    # 결과 반환
    return {
        "total_available_spots": TOTAL_SPOTS - total_occupied,
        "disabled_spots_left": max(0, disabled_spots_left),  # 남은 자리가 음수가 되지 않도록 0을 최소값으로 설정
        "non_disabled_spots_left": max(0, non_disabled_spots_left)
    }
