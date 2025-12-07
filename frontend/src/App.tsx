import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, BookOutlined, FileTextOutlined, CodeOutlined } from '@ant-design/icons';

// 导入页面组件（后续会创建这些组件）
import Dashboard from './pages/Dashboard';
import InterviewQuestions from './pages/InterviewQuestions';
import KnowledgePoints from './pages/KnowledgePoints';
import CodingQuestions from './pages/CodingQuestions';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout style={{ height: '100vh' }}>
        <Sider width={250} theme="light">
          <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              InterviewPrep Manager
            </Title>
          </div>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={['dashboard']}
          >
            <Menu.Item key="dashboard" icon={<HomeOutlined />}>
              <Link to="/">仪表盘</Link>
            </Menu.Item>
            <Menu.Item key="interview-questions" icon={<BookOutlined />}>
              <Link to="/interview-questions">面试题库</Link>
            </Menu.Item>
            <Menu.Item key="knowledge-points" icon={<FileTextOutlined />}>
              <Link to="/knowledge-points">知识点库</Link>
            </Menu.Item>
            <Menu.Item key="coding-questions" icon={<CodeOutlined />}>
              <Link to="/coding-questions">刷题题库</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/interview-questions" element={<InterviewQuestions />} />
              <Route path="/knowledge-points" element={<KnowledgePoints />} />
              <Route path="/coding-questions" element={<CodingQuestions />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;