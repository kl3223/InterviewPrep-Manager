from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database import get_db
from backend.models import InterviewQuestion, KnowledgePoint, CodingQuestion

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    获取仪表盘统计数据
    """
    # 面试题库统计
    interview_total = db.query(InterviewQuestion).count()
    interview_status_counts = db.query(InterviewQuestion.status, db.query(InterviewQuestion).filter(InterviewQuestion.status == InterviewQuestion.status).count()).group_by(InterviewQuestion.status).all()
    interview_stats = {
        "total": interview_total,
        "status_counts": dict(interview_status_counts)
    }
    
    # 知识点库统计
    knowledge_total = db.query(KnowledgePoint).count()
    knowledge_status_counts = db.query(KnowledgePoint.status, db.query(KnowledgePoint).filter(KnowledgePoint.status == KnowledgePoint.status).count()).group_by(KnowledgePoint.status).all()
    knowledge_stats = {
        "total": knowledge_total,
        "status_counts": dict(knowledge_status_counts),
        "starred_count": db.query(KnowledgePoint).filter(KnowledgePoint.starred == True).count()
    }
    
    # 刷题题库统计
    coding_total = db.query(CodingQuestion).count()
    coding_status_counts = db.query(CodingQuestion.status, db.query(CodingQuestion).filter(CodingQuestion.status == CodingQuestion.status).count()).group_by(CodingQuestion.status).all()
    coding_stats = {
        "total": coding_total,
        "status_counts": dict(coding_status_counts)
    }
    
    # 总体完成度
    overall_stats = {
        "total_items": interview_total + knowledge_total + coding_total,
        "completed_items": (
            db.query(InterviewQuestion).filter(InterviewQuestion.status == "已掌握").count() +
            db.query(KnowledgePoint).filter(KnowledgePoint.status == "掌握").count() +
            db.query(CodingQuestion).filter(CodingQuestion.status == "已做").count()
        )
    }
    
    if overall_stats["total_items"] > 0:
        overall_stats["completion_rate"] = round(overall_stats["completed_items"] / overall_stats["total_items"] * 100, 2)
    else:
        overall_stats["completion_rate"] = 0
    
    return {
        "interview_questions": interview_stats,
        "knowledge_points": knowledge_stats,
        "coding_questions": coding_stats,
        "overall": overall_stats
    }

@router.get("/today-tasks")
def get_today_tasks(db: Session = Depends(get_db)):
    """
    获取今日任务列表
    """
    # 今日任务：需要复习的面试题、需要重看的知识点、需要复盘的编程题
    review_interview_questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.status.in_(["需要复习", "重要"])
    ).limit(10).all()
    
    review_knowledge_points = db.query(KnowledgePoint).filter(
        KnowledgePoint.status == "重看"
    ).limit(10).all()
    
    review_coding_questions = db.query(CodingQuestion).filter(
        CodingQuestion.status == "复盘"
    ).limit(10).all()
    
    return {
        "interview_questions": [{
            "id": q.id,
            "title": q.title,
            "category": q.category
        } for q in review_interview_questions],
        "knowledge_points": [{
            "id": p.id,
            "title": p.title,
            "category": p.category
        } for p in review_knowledge_points],
        "coding_questions": [{
            "id": q.id,
            "title": q.title,
            "category": q.category
        } for q in review_coding_questions]
    }