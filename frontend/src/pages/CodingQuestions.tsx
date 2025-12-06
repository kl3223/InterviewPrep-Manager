import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LinkOutlined } from '@ant-design/icons';
import { codingQuestionApi } from '../services/api';
import { CodingQuestion, CodingQuestionCreate, CodingQuestionUpdate } from '../types';

const { Option } = Select;
const { Text } = Typography;

const CodingQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CodingQuestion | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // 状态选项
  const statusOptions = ['未做', '已做', '复盘'];

  useEffect(() => {
    fetchQuestions();
  }, [searchText, selectedCategory, selectedStatus]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchText) params.search = searchText;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      
      const response = await codingQuestionApi.getAll(params);
      setQuestions(response.data);
    } catch (error) {
      message.error('获取刷题库失败');
      console.error('Error fetching coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentQuestion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (question: CodingQuestion) => {
    setIsEditMode(true);
    setCurrentQuestion(question);
    form.setFieldsValue(question);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditMode && currentQuestion) {
        // 更新题目
        await codingQuestionApi.update(currentQuestion.id, values);
        message.success('题目更新成功');
      } else {
        // 创建新题目
        await codingQuestionApi.create(values);
        message.success('题目创建成功');
      }
      
      setIsModalVisible(false);
      fetchQuestions();
    } catch (error) {
      message.error('操作失败');
      console.error('Error handling form submission:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await codingQuestionApi.delete(id);
      message.success('题目删除成功');
      fetchQuestions();
    } catch (error) {
      message.error('删除失败');
      console.error('Error deleting coding question:', error);
    }
  };

  // 获取所有分类
  const categories = Array.from(new Set(questions.map(q => q.category)));

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 300,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: '来源链接',
      dataIndex: 'source_url',
      key: 'source_url',
      ellipsis: true,
      render: (url: string) => (
        <Text
          ellipsis
          style={{ maxWidth: 200, display: 'inline-block' }}
        >
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <LinkOutlined /> {url}
            </a>
          ) : (
            '-'  
          )}
        </Text>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CodingQuestion) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>刷题库</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增题目
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          placeholder="搜索题目"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="选择分类"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: 150 }}
        >
          <Option value="">全部</Option>
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
        <Select
          placeholder="选择状态"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: 150 }}
        >
          <Option value="">全部</Option>
          {statusOptions.map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEditMode ? "编辑题目" : "新增题目"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '未做',
            source_url: '',
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入题目标题' }]}
          >
            <Input placeholder="请输入题目标题" />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Input placeholder="请输入分类" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              {statusOptions.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="source_url"
            label="来源链接"
          >
            <Input placeholder="请输入题目来源链接（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 辅助函数：根据状态返回不同的颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '未做': 'default',
    '已做': 'success',
    '复盘': 'warning'
  };
  return colorMap[status] || 'default';
};

export default CodingQuestions;