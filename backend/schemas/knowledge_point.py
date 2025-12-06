from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class KnowledgePointBase(BaseModel):
    """
    知识点库基础模型
    """
    title: str = Field(..., min_length=1, max_length=255)
    content: Optional[str] = None
    category: str = Field(..., max_length=100)
    status: str = Field(..., max_length=50)
    starred: bool = False

class KnowledgePointCreate(KnowledgePointBase):
    """
    创建知识点的请求模型
    """
    pass

class KnowledgePointUpdate(KnowledgePointBase):
    """
    更新知识点的请求模型
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field(None, max_length=50)

class KnowledgePoint(KnowledgePointBase):
    """
    知识点的响应模型
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True