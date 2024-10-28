from datetime import datetime

from sqlalchemy.orm import Session

from models.parking import Parking, Parkseat
from schema.parking import ParkingBase, ParkseatBase

TOTAL_SPOTS = 100
DISABLED_SPOTS = 3


def register(db: Session, parking_data: ParkingBase):
    # Parking와 Parkseat 객체 생성
    parking = Parking(
        carnum=parking_data.carnum,
        barrier=parking_data.barrier,
        intime=parking_data.intime,
    )
    parkseat = Parkseat(
        carnum=parking_data.carnum,
        barrier=parking_data.barrier,
    )

    # 두 객체를 추가하고 커밋
    db.add_all([parking, parkseat])
    db.commit()
    db.refresh(parking)  # 필요한 경우, db.refresh(parkseat)로 갱신 가능
    return parking


def vehiclelist(db: Session):
    return db.query(Parking.carnum, Parking.barrier, Parking.intime,
                    Parking.pno).order_by(Parking.pno.desc()).all()


def parkseatlist(db: Session):
    return db.query(Parkseat.id, Parkseat.carnum,
                    Parkseat.barrier).order_by(Parkseat.id.desc()).all()


def vehicleone(db: Session, pno: int):
    parking = db.query(Parking).filter(Parking.pno == pno).first()

    if parking:
        response_data = {
            "pno": parking.pno,
            "carnum": parking.carnum,
            "barrier": parking.barrier,
            "intime": parking.intime,
            "outtime": parking.outtime if parking.outtime else None  # None이 아닐 경우에만 포함
        }
        return response_data
    return None


def vehicledelete(db: Session, id: int):
    parked_car = db.query(Parkseat).filter(Parkseat.id == id).first()

    if parked_car:
        # 차량의 PNO를 이용해 Parking 테이블에서 해당 차량 정보 가져오기
        parking_record = db.query(Parking).filter(Parking.carnum == parked_car.carnum).first()

        if parking_record:
            # 삭제 시간을 현재 시간으로 설정
            parking_record.outtime = datetime.now()

            # Parking 테이블에 변경사항 커밋
            db.commit()

        # Parkseat에서 차량 삭제
        db.delete(parked_car)
        db.commit()

        # 남은 자리 수 계산
        available_spots = get_available_spots(db)
        return available_spots
    else:
        raise Exception("해당 차량을 찾을 수 없습니다.")


def get_available_spots(db: Session):
    # 장애인 차량과 비장애인 차량의 수를 각각 조회
    total_parked = db.query(Parkseat).count()
    disabled_parked = db.query(Parkseat).filter(True == Parkseat.barrier).count()
    regular_parked = db.query(Parkseat).filter(False == Parkseat.barrier).count()

    # 남은 자리 수 계산
    available_spots = TOTAL_SPOTS - total_parked
    available_disabled_spots = DISABLED_SPOTS - disabled_parked
    available_regular_spots = (TOTAL_SPOTS - DISABLED_SPOTS) - regular_parked

    return {
        "total_available_spots": available_spots,
        "disabled_spots_left": max(0, available_disabled_spots),
        "non_disabled_spots_left": max(0, available_regular_spots)
    }


def park_vehicle(db: Session, carnum: str, barrier: bool):
    # 차량 정보를 테이블에 추가
    new_parking = Parkseat(carnum=carnum, barrier=barrier)
    db.add(new_parking)
    db.commit()

    # 남은 자리 수 계산
    available_spots = get_available_spots(db)
    return available_spots
