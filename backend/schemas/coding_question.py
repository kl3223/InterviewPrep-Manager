from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CodingQuestionBase(BaseModel):
    """
    刷题题库基础模型
    """
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., max_length=100)
    status: str = Field(..., max_length=50)
    source_url: Optional[str] = Field(None, max_length=255)

class CodingQuestionCreate(CodingQuestionBase):
    """
    创建编程题目的请求模型
    """
    pass

class CodingQuestionUpdate(CodingQuestionBase):
    """
    更新编程题目的请求模型
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field(None, max_length=50)

class CodingQuestion(CodingQuestionBase):
    """
    编程题目的响应模型
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True