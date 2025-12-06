# 测试数据库连接和操作功能
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.abspath('.'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.models.interview_question import InterviewQuestion
from backend.models.knowledge_point import KnowledgePoint
from backend.models.coding_question import CodingQuestion

def test_database_operations():
    print("测试数据库连接和操作...")
    
    # 创建数据库引擎
    from backend.database import engine
    
    # 创建会话
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 测试1：检查数据库表是否存在
        print("\n1. 检查数据库表是否存在...")
        tables = Base.metadata.tables.keys()
        print(f"存在的表: {list(tables)}")
        
        # 测试2：插入一条面试题库记录
        print("\n2. 插入一条面试题库记录...")
        new_question = InterviewQuestion(
            title="测试题目",
            description="测试描述",
            category="测试分类",
            status="未学",
            tags="测试,标签"
        )
        db.add(new_question)
        db.commit()
        db.refresh(new_question)
        print(f"插入成功，ID: {new_question.id}")
        
        # 测试3：查询面试题库记录
        print("\n3. 查询面试题库记录...")
        questions = db.query(InterviewQuestion).all()
        print(f"共查询到 {len(questions)} 条记录")
        for q in questions[:5]:  # 只显示前5条
            print(f"ID: {q.id}, 标题: {q.title}, 状态: {q.status}")
        
        # 测试4：更新面试题库记录
        print("\n4. 更新面试题库记录...")
        if new_question:
            new_question.status = "已掌握"
            db.commit()
            db.refresh(new_question)
            print(f"更新成功，状态变为: {new_question.status}")
        
        # 测试5：删除面试题库记录
        print("\n5. 删除面试题库记录...")
        if new_question:
            db.delete(new_question)
            db.commit()
            print("删除成功")
        
        # 测试6：验证删除结果
        print("\n6. 验证删除结果...")
        deleted_question = db.query(InterviewQuestion).filter_by(id=new_question.id).first()
        if deleted_question is None:
            print("验证成功，记录已删除")
        else:
            print("验证失败，记录仍然存在")
        
        print("\n✅ 数据库操作测试完成！")
        
    except Exception as e:
        print(f"❌ 数据库操作测试失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_database_operations()