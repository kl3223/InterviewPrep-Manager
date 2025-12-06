from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import CodingQuestion
from ..schemas import CodingQuestion as CodingQuestionSchema, CodingQuestionCreate, CodingQuestionUpdate

router = APIRouter(
    prefix="/coding-questions",
    tags=["coding-questions"],
)

@router.post("/", response_model=CodingQuestionSchema)
def create_coding_question(question: CodingQuestionCreate, db: Session = Depends(get_db)):
    """
    创建新的编程题目
    """
    db_question = CodingQuestion(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=List[CodingQuestionSchema])
def read_coding_questions(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    获取编程题目列表，支持筛选和搜索
    """
    query = db.query(CodingQuestion)
    
    if category:
        query = query.filter(CodingQuestion.category == category)
    if status:
        query = query.filter(CodingQuestion.status == status)
    if search:
        query = query.filter(CodingQuestion.title.contains(search))
    
    return query.offset(skip).limit(limit).all()

@router.get("/{question_id}", response_model=CodingQuestionSchema)
def read_coding_question(question_id: int, db: Session = Depends(get_db)):
    """
    根据ID获取编程题目
    """
    question = db.query(CodingQuestion).filter(CodingQuestion.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Coding question not found")
    return question

@router.put("/{question_id}", response_model=CodingQuestionSchema)
def update_coding_question(question_id: int, question: CodingQuestionUpdate, db: Session = Depends(get_db)):
    """
    更新编程题目
    """
    db_question = db.query(CodingQuestion).filter(CodingQuestion.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Coding question not found")
    
    # 更新字段
    for field, value in question.model_dump(exclude_unset=True).items():
        setattr(db_question, field, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/{question_id}")
def delete_coding_question(question_id: int, db: Session = Depends(get_db)):
    """
    删除编程题目
    """
    db_question = db.query(CodingQuestion).filter(CodingQuestion.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Coding question not found")
    
    db.delete(db_question)
    db.commit()
    return {"message": "Coding question deleted successfully"}