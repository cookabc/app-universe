# 贡献指南

感谢您对Website Health Check Framework项目的关注！我们欢迎各种形式的贡献。

## 🚀 快速开始

### 开发环境设置

1. **Fork并克隆仓库**
```bash
git clone https://github.com/your-username/website-health-check.git
cd website-health-check
```

2. **安装依赖**
```bash
# 确保安装了uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装项目依赖
uv sync
```

3. **运行测试**
```bash
uv run python -m pytest tests/ -v
```

## 📋 贡献类型

### 🐛 Bug报告
- 使用GitHub Issues报告bug
- 提供详细的复现步骤
- 包含系统信息和错误日志

### ✨ 功能请求
- 查看[项目路线图](docs/ROADMAP.md)了解计划中的功能
- 在Issues中描述新功能的用例和价值

### 🔧 代码贡献
- 查看[架构文档](docs/ARCHITECTURE.md)了解系统设计
- 遵循现有的代码风格和约定
- 为新功能添加测试用例

## 📝 开发规范

### 代码风格
- 遵循PEP 8 Python代码规范
- 使用类型注解
- 添加详细的docstring
- 保持函数和类的单一职责

### 提交规范
使用[约定式提交](https://www.conventionalcommits.org/)格式：

```
<类型>: <描述>

[可选的正文]

[可选的脚注]
```

**类型**:
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `test`: 测试相关
- `refactor`: 代码重构
- `perf`: 性能优化
- `chore`: 构建过程或辅助工具的变动

**示例**:
```
feat: 添加可访问性检查模块

实现WCAG 2.1 AA标准的基础检查功能，包括：
- 颜色对比度检查
- 图片alt属性验证
- 表单标签关联检查

Closes #123
```

### 测试要求
- 所有新功能必须有对应的测试
- 测试覆盖率不能降低
- 运行`uv run python -m pytest tests/ -v`确保所有测试通过

## 🔄 开发流程

### 1. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

### 2. 开发和测试
```bash
# 开发代码
# 添加测试
uv run python -m pytest tests/ -v
```

### 3. 提交代码
```bash
git add .
git commit -m "feat: 描述你的功能"
```

### 4. 推送并创建PR
```bash
git push origin feature/your-feature-name
# 在GitHub上创建Pull Request
```

## 🏗️ 架构指南

### 添加新的分析模块
```python
from health_check.core.base import AssessmentModule, AssessmentResult

class MyModule(AssessmentModule):
    def __init__(self, config):
        super().__init__("my_module", config)
    
    async def assess(self, target: str) -> AssessmentResult:
        # 实现分析逻辑
        result = AssessmentResult(self.name, score)
        return result
    
    def get_module_info(self):
        return {
            "name": self.name,
            "description": "我的分析模块",
            "version": "1.0.0",
            "checks": ["检查项1", "检查项2"]
        }
```

### 添加新的报告格式
```python
from health_check.core.base import ReportGenerator

class MyReportGenerator(ReportGenerator):
    def generate(self, report: HealthCheckReport) -> str:
        # 实现报告生成逻辑
        return report_file_path
    
    def get_supported_formats(self) -> List[str]:
        return ["my_format"]
```

## 📚 资源

- [项目路线图](docs/ROADMAP.md) - 了解项目发展计划
- [架构文档](docs/ARCHITECTURE.md) - 深入了解系统设计
- [GitHub Issues](https://github.com/cookabc/website-health-check/issues) - 查看当前问题和功能请求

## 🤝 社区

- 在Issues中讨论想法和问题
- 遵循[行为准则](CODE_OF_CONDUCT.md)
- 尊重所有贡献者

## 📄 许可证

通过贡献代码，您同意您的贡献将在[MIT许可证](LICENSE)下发布。

---

感谢您的贡献！🎉