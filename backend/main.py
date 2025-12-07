from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import interview_question_router, knowledge_point_router, coding_question_router, dashboard_router

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(
    title="InterviewPrep Manager API",
    description="API for managing interview preparation materials",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(interview_question_router)
app.include_router(knowledge_point_router)
app.include_router(coding_question_router)
app.include_router(dashboard_router)

# 根路径
@app.get("/")
def read_root():
    return {"message": "Welcome to InterviewPrep Manager API"}