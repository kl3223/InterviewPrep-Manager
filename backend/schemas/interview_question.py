from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class InterviewQuestionBase(BaseModel):
    """
    面试题库基础模型
    """
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field(..., max_length=100)
    status: str = Field(..., max_length=50)
    tags: Optional[str] = None

class InterviewQuestionCreate(InterviewQuestionBase):
    """
    创建面试题目的请求模型
    """
    pass

class InterviewQuestionUpdate(InterviewQuestionBase):
    """
    更新面试题目的请求模型
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field(None, max_length=50)

class InterviewQuestion(InterviewQuestionBase):
    """
    面试题目的响应模型
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True