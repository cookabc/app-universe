#!/usr/bin/env python3
"""
源码分析示例

展示如何使用健康检查框架分析本地HTML项目。
"""

import asyncio
import tempfile
import os
from pathlib import Path

from health_check.core.config import HealthCheckConfig, ModuleConfig
from health_check.health_checker import HealthChecker
from health_check.modules.source_html_module import SourceHTMLModule
from health_check.reports.json_generator import JSONReportGenerator


def create_sample_project():
    """创建一个示例项目用于演示"""
    temp_dir = Path(tempfile.mkdtemp(prefix="html_project_"))
    
    # 创建项目结构
    (temp_dir / "css").mkdir()
    (temp_dir / "js").mkdir()
    (temp_dir / "images").mkdir()
    (temp_dir / "pages").mkdir()
    
    # 创建一个好的HTML文件
    good_html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>优秀的网页示例 - 完整的HTML结构</title>
    <meta name="description" content="这是一个结构良好的HTML页面示例，包含了所有必要的SEO和可访问性元素。">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <h1>网站标题</h1>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h1>页面主标题</h1>
            <section>
                <h2>内容部分</h2>
                <p>这是页面的主要内容。</p>
                <img src="images/example.jpg" alt="示例图片描述">
                
                <form>
                    <label for="name">姓名:</label>
                    <input type="text" id="name" name="name">
                    
                    <label for="email">邮箱:</label>
                    <input type="email" id="email" name="email">
                    
                    <button type="submit">提交</button>
                </form>
            </section>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2025 示例网站</p>
    </footer>
    
    <script src="js/script.js" defer></script>
</body>
</html>"""
    
    # 创建一个有问题的HTML文件
    problematic_html = """<html>
<head>
    <title>短</title>
</head>
<body>
    <h1>标题1</h1>
    <h1>标题2</h1>
    
    <img src="image1.jpg">
    <img src="image2.jpg">
    <img src="image3.jpg">
    
    <form>
        <input type="text" placeholder="姓名">
        <input type="email" placeholder="邮箱">
        <input type="password" placeholder="密码">
        <button>提交</button>
    </form>
    
    <div style="color: red; font-size: 14px; background: blue; margin: 10px; padding: 5px;">内联样式过多</div>
    <div style="color: green; font-size: 16px;">更多内联样式</div>
    <div style="color: yellow; font-size: 18px;">还有内联样式</div>
    <div style="color: purple; font-size: 20px;">继续内联样式</div>
    <div style="color: orange; font-size: 22px;">更多内联样式</div>
    <div style="color: pink; font-size: 24px;">最后的内联样式</div>
    
    <!-- TODO: 需要添加更多内容 -->
    <!-- FIXME: 修复样式问题 -->
    
    <script src="blocking-script1.js"></script>
    <script src="blocking-script2.js"></script>
    
    <p>这是一行非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的文本，超过了120个字符的限制。</p>
</body>
</html>"""
    
    # 创建一个最小的HTML文件
    minimal_html = """<html>
<body>
    <p>最小内容</p>
</body>
</html>"""
    
    # 写入文件
    (temp_dir / "index.html").write_text(good_html, encoding='utf-8')
    (temp_dir / "pages" / "problematic.html").write_text(problematic_html, encoding='utf-8')
    (temp_dir / "pages" / "minimal.html").write_text(minimal_html, encoding='utf-8')
    
    # 创建一些非HTML文件
    (temp_dir / "css" / "style.css").write_text("body { margin: 0; }", encoding='utf-8')
    (temp_dir / "js" / "script.js").write_text("console.log('Hello');", encoding='utf-8')
    (temp_dir / "README.md").write_text("# 项目说明", encoding='utf-8')
    
    return temp_dir


async def run_source_analysis_example():
    """运行源码分析示例"""
    print("🚀 源码分析示例")
    print("=" * 60)
    
    # 创建示例项目
    print("\n📁 创建示例项目...")
    project_dir = create_sample_project()
    print(f"   项目路径: {project_dir}")
    
    # 显示项目结构
    print(f"\n📂 项目结构:")
    for root, dirs, files in os.walk(project_dir):
        level = root.replace(str(project_dir), '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f"{subindent}{file}")
    
    # 创建配置
    config = HealthCheckConfig()
    config.verbose_logging = False
    config.report.output_directory = "reports"
    
    # 创建健康检查器
    checker = HealthChecker(config)
    
    # 注册源码HTML分析模块
    source_html_module = SourceHTMLModule(ModuleConfig())
    checker.register_module(source_html_module)
    
    # 注册JSON报告生成器
    json_generator = JSONReportGenerator(config.report)
    checker.register_report_generator(json_generator)
    
    print(f"\n📋 分析模块信息:")
    info = source_html_module.get_module_info()
    print(f"  名称: {info['name']}")
    print(f"  描述: {info['description']}")
    print(f"  版本: {info['version']}")
    print(f"  分析类型: {info['analysis_type']}")
    print(f"  支持文件: {', '.join(info['supported_files'])}")
    print(f"  检查项目:")
    for check in info['checks']:
        print(f"    • {check}")
    
    print(f"\n🔍 开始分析源码: {project_dir}")
    
    # 运行源码分析
    report = await checker.run_health_check(str(project_dir))
    
    # 显示结果
    print(f"\n📊 分析结果:")
    print(f"  总体得分: {report.overall_score:.1f}/100")
    print(f"  评估ID: {report.assessment_id}")
    
    # 显示源码HTML模块的详细结果
    html_result = report.modules.get('sourcehtml')
    if html_result:
        print(f"\n🔍 源码HTML分析详情:")
        print(f"  模块得分: {html_result.score:.1f}/100")
        print(f"  执行时间: {html_result.execution_time:.2f}秒")
        print(f"  发现问题: {len(html_result.issues)}个")
        print(f"  改进建议: {len(html_result.recommendations)}个")
        
        # 显示问题详情
        if html_result.issues:
            print(f"\n  ⚠️ 发现的问题:")
            for i, issue in enumerate(html_result.issues[:10], 1):  # 显示前10个
                severity_icon = "🔴" if issue.severity.value == "error" else "🟡" if issue.severity.value == "warning" else "🔵"
                print(f"    {i}. {severity_icon} {issue.message}")
                if issue.location and issue.location.get('file'):
                    print(f"       📁 文件: {issue.location['file']}")
                if issue.fix_suggestion:
                    print(f"       💡 建议: {issue.fix_suggestion}")
            
            if len(html_result.issues) > 10:
                print(f"    ... 还有 {len(html_result.issues) - 10} 个问题")
        
        # 显示改进建议
        if html_result.recommendations:
            print(f"\n  💡 改进建议:")
            for i, rec in enumerate(html_result.recommendations, 1):
                priority_icon = "🔥" if rec.priority.value == "high" else "🟡" if rec.priority.value == "medium" else "🟢"
                print(f"    {i}. {priority_icon} {rec.title}")
                print(f"       描述: {rec.description}")
                print(f"       优先级: {rec.priority.value} | 工作量: {rec.effort.value} | 影响: {rec.impact.value}")
                print(f"       预估时间: {rec.estimated_hours}小时")
        
        # 显示项目级别指标
        print(f"\n  📈 项目指标:")
        metrics = html_result.metrics
        
        # 项目结构
        print(f"    项目结构:")
        print(f"      • 总文件数: {metrics.get('total_files', 0)}")
        print(f"      • 项目大小: {metrics.get('total_size_mb', 0)}MB")
        print(f"      • 目录深度: {metrics.get('directory_structure_depth', 0)}")
        print(f"      • 文件类型: {len(metrics.get('file_types', {}))}")
        
        # HTML文件统计
        print(f"    HTML文件:")
        print(f"      • HTML文件数: {metrics.get('html_files_count', 0)}")
        print(f"      • 平均文件大小: {metrics.get('average_file_size', 0):.0f}字节")
        print(f"      • 平均得分: {metrics.get('average_score', 0):.1f}/100")
        print(f"      • 有问题的文件: {metrics.get('files_with_issues', 0)}")
        
        # 内容统计
        print(f"    内容分析:")
        print(f"      • 总图片数: {metrics.get('total_images_all_files', 0)}")
        print(f"      • 缺少Alt的图片: {metrics.get('total_images_without_alt', 0)}")
        print(f"      • Alt属性覆盖率: {metrics.get('alt_attribute_coverage', 0):.1f}%")
        print(f"      • 有H1标题的文件: {metrics.get('files_with_h1', 0)}")
        print(f"      • 有Meta描述的文件: {metrics.get('files_with_meta_description', 0)}")
        print(f"      • 有Viewport的文件: {metrics.get('files_with_viewport', 0)}")
        
        # 文件类型分布
        file_types = metrics.get('file_types', {})
        if file_types:
            print(f"    文件类型分布:")
            for ext, count in file_types.items():
                print(f"      • {ext or '无扩展名'}: {count}个")
    
    # 生成报告
    print(f"\n📄 生成详细报告...")
    report_paths = await checker.generate_reports(report)
    
    for path in report_paths:
        print(f"  ✅ 报告已保存: {path}")
    
    # 显示优先级建议
    if report.priority_matrix:
        print(f"\n🎯 优先改进建议:")
        for i, rec in enumerate(report.priority_matrix[:5], 1):
            priority_icon = "🔥" if rec.priority.value == "high" else "🟡" if rec.priority.value == "medium" else "🟢"
            print(f"  {i}. {priority_icon} {rec.title}")
            print(f"     优先级: {rec.priority.value} | 预估时间: {rec.estimated_hours}小时")
    
    print(f"\n✅ 源码分析完成！")
    print(f"📁 示例项目保留在: {project_dir}")
    print("=" * 60)


async def analyze_project_directory(directory: str):
    """分析指定的项目目录"""
    project_path = Path(directory)
    
    if not project_path.exists():
        print(f"❌ 错误: 目录不存在: {directory}")
        return
    
    if not project_path.is_dir():
        print(f"❌ 错误: 不是一个目录: {directory}")
        return
    
    print(f"🔍 分析项目目录: {directory}")
    
    # 创建配置
    config = HealthCheckConfig()
    config.verbose_logging = False
    config.report.output_directory = "reports"
    
    # 创建检查器
    checker = HealthChecker(config)
    checker.register_module(SourceHTMLModule(ModuleConfig()))
    checker.register_report_generator(JSONReportGenerator(config.report))
    
    try:
        # 运行分析
        report = await checker.run_health_check(directory)
        
        # 显示简要结果
        print(f"✅ 分析完成")
        print(f"   总体得分: {report.overall_score:.1f}/100")
        print(f"   发现问题: {len(report.get_all_issues())}个")
        print(f"   改进建议: {len(report.get_all_recommendations())}个")
        
        # 生成报告
        report_paths = await checker.generate_reports(report)
        for path in report_paths:
            print(f"   报告: {path}")
            
    except Exception as e:
        print(f"❌ 分析失败: {e}")


if __name__ == "__main__":
    # 可以直接运行这个文件进行源码分析
    import sys
    
    if len(sys.argv) > 1:
        # 如果提供了目录参数，分析该目录
        directory = sys.argv[1]
        asyncio.run(analyze_project_directory(directory))
    else:
        # 否则运行示例
        asyncio.run(run_source_analysis_example())