from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Parking(Base):
    __tablename__ = 'parking'

    pno = Column(Integer, primary_key=True, autoincrement=True, index=True)
    carnum = Column(String(50), nullable=False)
    barrier = Column(Boolean, nullable=False)
    intime = Column(DateTime, nullable=True)
    outtime = Column(DateTime, nullable=True)

class Parkseat(Base):
    __tablename__ = 'parkseat'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    carnum = Column(String(50), nullable=False)  # 차량 번호
    barrier = Column(Boolean, nullable=False)    # 장애인 여부 (True: 장애인, False: 일반 차량)