from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import KnowledgePoint
from ..schemas import KnowledgePoint as KnowledgePointSchema, KnowledgePointCreate, KnowledgePointUpdate

router = APIRouter(
    prefix="/knowledge-points",
    tags=["knowledge-points"],
)

@router.post("/", response_model=KnowledgePointSchema)
def create_knowledge_point(point: KnowledgePointCreate, db: Session = Depends(get_db)):
    """
    创建新的知识点
    """
    db_point = KnowledgePoint(**point.model_dump())
    db.add(db_point)
    db.commit()
    db.refresh(db_point)
    return db_point

@router.get("/", response_model=List[KnowledgePointSchema])
def read_knowledge_points(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    starred: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    获取知识点列表，支持筛选和搜索
    """
    query = db.query(KnowledgePoint)
    
    if category:
        query = query.filter(KnowledgePoint.category == category)
    if status:
        query = query.filter(KnowledgePoint.status == status)
    if search:
        query = query.filter(KnowledgePoint.title.contains(search) | KnowledgePoint.content.contains(search))
    if starred is not None:
        query = query.filter(KnowledgePoint.starred == starred)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{point_id}", response_model=KnowledgePointSchema)
def read_knowledge_point(point_id: int, db: Session = Depends(get_db)):
    """
    根据ID获取知识点
    """
    point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if point is None:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    return point

@router.put("/{point_id}", response_model=KnowledgePointSchema)
def update_knowledge_point(point_id: int, point: KnowledgePointUpdate, db: Session = Depends(get_db)):
    """
    更新知识点
    """
    db_point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if db_point is None:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    
    # 更新字段
    for field, value in point.model_dump(exclude_unset=True).items():
        setattr(db_point, field, value)
    
    db.commit()
    db.refresh(db_point)
    return db_point

@router.delete("/{point_id}")
def delete_knowledge_point(point_id: int, db: Session = Depends(get_db)):
    """
    删除知识点
    """
    db_point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if db_point is None:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    
    db.delete(db_point)
    db.commit()
    return {"message": "Knowledge point deleted successfully"}

@router.patch("/{point_id}/star")
def toggle_star_knowledge_point(point_id: int, db: Session = Depends(get_db)):
    """
    切换知识点的收藏状态
    """
    db_point = db.query(KnowledgePoint).filter(KnowledgePoint.id == point_id).first()
    if db_point is None:
        raise HTTPException(status_code=404, detail="Knowledge point not found")
    
    db_point.starred = not db_point.starred
    db.commit()
    db.refresh(db_point)
    return {"message": "Star status toggled successfully", "starred": db_point.starred}