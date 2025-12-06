from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base

class KnowledgePoint(Base):
    """
    知识点库模型
    """
    __tablename__ = "knowledge_points"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    content = Column(Text)  # Markdown 内容
    category = Column(String(100), index=True)
    status = Column(String(50), index=True)  # 未学 / 掌握 / 重看
    starred = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())