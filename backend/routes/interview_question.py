from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models import InterviewQuestion
from backend.schemas import InterviewQuestion as InterviewQuestionSchema, InterviewQuestionCreate, InterviewQuestionUpdate

router = APIRouter(
    prefix="/interview-questions",
    tags=["interview-questions"],
)

@router.post("/", response_model=InterviewQuestionSchema)
def create_interview_question(question: InterviewQuestionCreate, db: Session = Depends(get_db)):
    """
    创建新的面试题目
    """
    db_question = InterviewQuestion(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=List[InterviewQuestionSchema])
def read_interview_questions(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    category_search: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    获取面试题目列表，支持筛选和搜索
    """
    query = db.query(InterviewQuestion)
    
    if category:
        query = query.filter(InterviewQuestion.category == category)
    if category_search:
        query = query.filter(InterviewQuestion.category.contains(category_search))
    if status:
        query = query.filter(InterviewQuestion.status == status)
    if search:
        query = query.filter(InterviewQuestion.title.contains(search) | InterviewQuestion.description.contains(search))
    if tag:
        query = query.filter(InterviewQuestion.tags.contains(tag))
    
    return query.offset(skip).limit(limit).all()

@router.get("/{question_id}", response_model=InterviewQuestionSchema)
def read_interview_question(question_id: int, db: Session = Depends(get_db)):
    """
    根据ID获取面试题目
    """
    question = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Interview question not found")
    return question

@router.put("/{question_id}", response_model=InterviewQuestionSchema)
def update_interview_question(question_id: int, question: InterviewQuestionUpdate, db: Session = Depends(get_db)):
    """
    更新面试题目
    """
    db_question = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Interview question not found")
    
    # 更新字段
    for field, value in question.model_dump(exclude_unset=True).items():
        setattr(db_question, field, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/{question_id}")
def delete_interview_question(question_id: int, db: Session = Depends(get_db)):
    """
    删除面试题目
    """
    db_question = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if db_question is None:
        raise HTTPException(status_code=404, detail="Interview question not found")
    
    db.delete(db_question)
    db.commit()
    return {"message": "Interview question deleted successfully"}