from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class CodingQuestion(Base):
    """
    刷题题库模型
    """
    __tablename__ = "coding_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    category = Column(String(100), index=True)
    status = Column(String(50), index=True)  # 未做 / 已做 / 复盘
    source_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())