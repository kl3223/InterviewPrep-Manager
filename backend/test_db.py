from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import sys

# 将项目根目录添加到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 现在可以导入模型和数据库组件
from backend.models.knowledge_point import KnowledgePoint
from backend.database import Base, SessionLocal, engine

# 获取项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 打印当前使用的数据库路径
print(f"使用的数据库路径: {os.path.join(BASE_DIR, 'backend', 'data', 'interview.db')}")

# 确保所有模型都被导入，以便注册到Base
from backend.models import interview_question, knowledge_point, coding_question

print("已导入所有模型，准备创建表...")

print("创建数据库表...")
Base.metadata.create_all(bind=engine)
print("数据库表创建成功！")

# 测试插入数据
db = SessionLocal()
try:
    print("插入测试数据...")
    test_knowledge = KnowledgePoint(
        title="测试知识点",
        content="这是一个测试知识点的内容",
        category="测试",
        status="未学",
        starred=False
    )
    db.add(test_knowledge)
    db.commit()
    db.refresh(test_knowledge)
    print(f"测试数据插入成功，ID: {test_knowledge.id}")
    
    # 测试查询数据
    all_knowledge = db.query(KnowledgePoint).all()
    print(f"当前知识点总数: {len(all_knowledge)}")
    
except Exception as e:
    print(f"测试过程中出现错误: {e}")
finally:
    db.close()

print("测试完成！")