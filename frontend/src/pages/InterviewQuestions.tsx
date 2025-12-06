import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { interviewQuestionApi } from '../services/api';
import { InterviewQuestion, InterviewQuestionCreate, InterviewQuestionUpdate } from '../types';

const { Option } = Select;
const { TextArea } = Input;

const InterviewQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // 状态选项
  const statusOptions = ['未学', '已掌握', '需要复习', '重要'];

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
      
      const response = await interviewQuestionApi.getAll(params);
      setQuestions(response.data);
    } catch (error) {
      message.error('获取面试题库失败');
      console.error('Error fetching interview questions:', error);
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

  const showEditModal = (question: InterviewQuestion) => {
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
        await interviewQuestionApi.update(currentQuestion.id, values);
        message.success('面试题目更新成功');
      } else {
        // 创建新题目
        await interviewQuestionApi.create(values);
        message.success('面试题目创建成功');
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
      await interviewQuestionApi.delete(id);
      message.success('面试题目删除成功');
      fetchQuestions();
    } catch (error) {
      message.error('删除失败');
      console.error('Error deleting interview question:', error);
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
      width: 250,
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
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string) => (
        <>{tags ? tags.split(',').map(tag => <Tag key={tag}>{tag}</Tag>) : null}</>
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
      render: (_: any, record: InterviewQuestion) => (
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
        <h2>面试题库</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增题目
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
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
        title={isEditMode ? "编辑面试题目" : "新增面试题目"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '未学',
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
            name="tags"
            label="标签"
            help="用逗号分隔多个标签"
          >
            <Input placeholder="例如：算法,数据结构,前端" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={6} placeholder="请输入题目描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 辅助函数：根据状态返回不同的颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '未学': 'default',
    '已掌握': 'success',
    '需要复习': 'warning',
    '重要': 'error'
  };
  return colorMap[status] || 'default';
};

export default InterviewQuestions;