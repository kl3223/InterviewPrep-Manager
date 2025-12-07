from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.database import Base

class InterviewQuestion(Base):
    """
    面试题库模型
    """
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    category = Column(String(100), index=True)
    status = Column(String(50), index=True)  # 未学 / 已掌握 / 需要复习 / 重要
    tags = Column(String(255))  # 用逗号分隔的标签
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())