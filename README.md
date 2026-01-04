# Website Health Check Framework

一个专业的网站健康检查Python框架，支持URL分析和源码分析，可以评估网站的HTML结构、SEO、可访问性等多个方面。

## 🚀 快速开始

### 安装
```bash
# 克隆项目
git clone <repository-url>
cd website-health-check

# 安装依赖
uv sync
```

### 基本使用

#### 命令行工具
```bash
# 交互模式 - 最简单的使用方式
uv run health_check_cli.py

# 分析在线网站
uv run health_check_cli.py --url https://example.com

# 分析本地项目
uv run health_check_cli.py --source ./my-website

# 指定输出目录
uv run health_check_cli.py --url https://example.com --output ./reports
```

#### 运行示例
```bash
# URL分析示例
uv run python examples/url_analysis.py

# 源码分析示例
uv run python examples/source_analysis.py

# 分析自定义URL/目录
uv run python examples/url_analysis.py https://your-website.com
uv run python examples/source_analysis.py /path/to/your/project
```

#### 验证安装
```bash
# 运行测试确保一切正常
uv run python -m pytest tests/ -v
```

## ✨ 功能特性

### 🌐 双模式分析
- **URL分析**: 分析在线网站的HTML结构和SEO
- **源码分析**: 分析本地HTML项目，支持批量处理

### 🔍 全面检查
- **HTML5文档结构**: DOCTYPE、lang属性、字符编码
- **SEO基础元素**: meta描述、viewport设置、标题结构
- **可访问性检查**: 图片alt属性、表单标签关联
- **性能优化提示**: 阻塞脚本检测、内联样式过多
- **代码质量检查**: TODO注释、代码行长度

### 📊 智能报告
- **JSON格式报告**: 结构化数据，便于集成
- **项目级别统计**: 整体健康状况评估
- **文件级别定位**: 精确的问题定位和修复建议
- **优先级排序**: 按影响和工作量排序的改进建议

### 🏗️ 架构优势
- **模块化设计**: 易于扩展新的分析模块
- **异步并发**: 高效的性能表现
- **完整测试**: 42个测试用例，100%通过率
- **类型安全**: 完整的类型注解

## 🎯 使用场景

### 开发阶段质量检查
```bash
# 分析本地HTML项目
uv run health_check_cli.py --source ./my-project
```

### 在线网站分析
```bash
# 分析已部署的网站
uv run health_check_cli.py --url https://example.com
```

### Python API集成
```python
from health_check.core.config import HealthCheckConfig
from health_check.health_checker import HealthChecker
from health_check.modules.html_module import HTMLModule
from health_check.reports.json_generator import JSONReportGenerator

# 创建配置
config = HealthCheckConfig()
config.target_url = "https://example.com"

# 创建检查器
checker = HealthChecker(config)
checker.register_module(HTMLModule(ModuleConfig()))
checker.register_report_generator(JSONReportGenerator(config.report))

# 运行分析
report = await checker.run_health_check()
```

### 批量分析
```bash
# 使用脚本批量分析多个网站
for url in https://site1.com https://site2.com; do
    uv run health_check_cli.py --url $url --output reports/$(basename $url)
done
```

## 📁 项目结构

```
website-health-check/
├── health_check/              # 核心框架代码
│   ├── core/                 # 核心组件
│   │   ├── base.py           # 基础类和数据模型
│   │   ├── config.py         # 配置管理
│   │   └── source_analysis.py # 源码分析基础架构
│   ├── modules/              # 评估模块
│   │   ├── html_module.py    # HTML分析模块
│   │   └── source_html_module.py # 源码HTML分析模块
│   ├── reports/              # 报告生成器
│   │   └── json_generator.py # JSON报告生成器
│   ├── cli.py                # 命令行界面
│   └── health_checker.py     # 主协调器
├── examples/                 # 使用示例
│   ├── url_analysis.py       # URL分析示例
│   └── source_analysis.py    # 源码分析示例
├── tests/                    # 测试文件 (42个测试)
├── docs/                     # 文档目录
├── health_check_cli.py       # 主命令行工具
└── config.example.yaml       # 示例配置
```

## 🧪 测试覆盖

项目包含42个测试用例，覆盖：
- 核心框架功能
- 配置系统
- HTML分析模块
- 源码分析模块
- JSON报告生成
- 边界情况和错误处理

```bash
# 运行所有测试
uv run python -m pytest tests/ -v

# 运行特定模块测试
uv run python -m pytest tests/test_source_html_module.py -v

# 生成测试覆盖率报告
uv run python -m pytest tests/ --cov=health_check --cov-report=html
```

## 🔧 开发

### 添加新的分析模块
```python
from health_check.core.base import AssessmentModule, AssessmentResult

class MyCustomModule(AssessmentModule):
    async def assess(self, target: str) -> AssessmentResult:
        # 实现你的分析逻辑
        result = AssessmentResult(self.name, score)
        return result
```

### 添加新的报告格式
```python
from health_check.core.base import ReportGenerator

class MyReportGenerator(ReportGenerator):
    def generate(self, report: HealthCheckReport) -> str:
        # 实现你的报告生成逻辑
        return report_path
```

## 📚 文档

- [🗺️ 项目路线图](docs/ROADMAP.md) - 项目历程、功能规划和开发计划
- [🏗️ 架构设计](docs/ARCHITECTURE.md) - 系统架构和技术设计文档

## 📈 项目价值

- **开发效率**: 在开发阶段就能发现和修复问题
- **质量保证**: 全面的HTML结构和SEO检查
- **批量处理**: 一次分析整个项目的所有HTML文件
- **精确定位**: 具体到文件和行号的问题报告
- **可操作建议**: 具体的修复建议和优先级排序

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**版本**: v0.1.0  
**状态**: 生产就绪  
**测试覆盖**: 42个测试，100%通过率