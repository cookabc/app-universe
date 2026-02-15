#!/usr/bin/env python3
"""
URL分析示例

展示如何使用健康检查框架分析在线网站。
"""

import asyncio
from health_check.core.config import HealthCheckConfig, ModuleConfig
from health_check.health_checker import HealthChecker
from health_check.modules.html_module import HTMLModule
from health_check.reports.json_generator import JSONReportGenerator


async def run_url_analysis_example():
    """运行URL分析示例"""
    print("🚀 URL分析示例")
    print("=" * 50)
    
    # 创建配置
    config = HealthCheckConfig()
    config.target_url = "https://chelseayao.com"
    config.verbose_logging = False
    config.report.output_directory = "reports"
    
    # 创建健康检查器
    checker = HealthChecker(config)
    
    # 注册HTML分析模块
    html_module = HTMLModule(ModuleConfig())
    checker.register_module(html_module)
    
    # 注册JSON报告生成器
    json_generator = JSONReportGenerator(config.report)
    checker.register_report_generator(json_generator)
    
    print(f"\n📋 分析模块信息:")
    info = html_module.get_module_info()
    print(f"  名称: {info['name']}")
    print(f"  描述: {info['description']}")
    print(f"  版本: {info['version']}")
    print(f"  检查项目:")
    for check in info['checks']:
        print(f"    • {check}")
    
    print(f"\n🔍 开始分析网站: {config.target_url}")
    
    # 运行健康检查
    report = await checker.run_health_check()
    
    # 显示结果
    print(f"\n📊 分析结果:")
    print(f"  总体得分: {report.overall_score:.1f}/100")
    print(f"  评估ID: {report.assessment_id}")
    
    # 显示HTML模块的详细结果
    html_result = report.modules.get('html')
    if html_result:
        print(f"\n🔍 HTML分析详情:")
        print(f"  模块得分: {html_result.score:.1f}/100")
        print(f"  执行时间: {html_result.execution_time:.2f}秒")
        print(f"  发现问题: {len(html_result.issues)}个")
        print(f"  改进建议: {len(html_result.recommendations)}个")
        
        # 显示问题详情
        if html_result.issues:
            print(f"\n  ⚠️ 发现的问题:")
            for i, issue in enumerate(html_result.issues[:5], 1):  # 显示前5个
                severity_icon = "🔴" if issue.severity.value == "error" else "🟡" if issue.severity.value == "warning" else "🔵"
                print(f"    {i}. {severity_icon} {issue.message}")
                if issue.fix_suggestion:
                    print(f"       💡 建议: {issue.fix_suggestion}")
            
            if len(html_result.issues) > 5:
                print(f"    ... 还有 {len(html_result.issues) - 5} 个问题")
        
        # 显示改进建议
        if html_result.recommendations:
            print(f"\n  💡 改进建议:")
            for i, rec in enumerate(html_result.recommendations[:3], 1):  # 显示前3个
                priority_icon = "🔥" if rec.priority.value == "high" else "🟡" if rec.priority.value == "medium" else "🟢"
                print(f"    {i}. {priority_icon} {rec.title}")
                print(f"       描述: {rec.description}")
                print(f"       优先级: {rec.priority.value} | 工作量: {rec.effort.value} | 影响: {rec.impact.value}")
                print(f"       预估时间: {rec.estimated_hours}小时")
        
        # 显示关键指标
        print(f"\n  📈 关键指标:")
        metrics = html_result.metrics
        
        print(f"    HTML结构:")
        print(f"      • 有标题: {'✅' if metrics.get('has_title') else '❌'}")
        print(f"      • 有Meta描述: {'✅' if metrics.get('has_meta_description') else '❌'}")
        print(f"      • 有Lang属性: {'✅' if metrics.get('has_lang_attribute') else '❌'}")
        print(f"      • 有字符编码: {'✅' if metrics.get('has_charset') else '❌'}")
        print(f"      • 有Viewport: {'✅' if metrics.get('has_viewport') else '❌'}")
        
        print(f"    内容统计:")
        print(f"      • 总图片数: {metrics.get('total_images', 0)}")
        print(f"      • 缺少Alt的图片: {metrics.get('images_without_alt', 0)}")
        print(f"      • H1标题数: {metrics.get('h1_count', 0)}")
        print(f"      • 总标题数: {metrics.get('total_headings', 0)}")
        print(f"      • 总链接数: {metrics.get('total_links', 0)}")
        
        print(f"    SEO元素:")
        print(f"      • 有Canonical: {'✅' if metrics.get('has_canonical') else '❌'}")
        print(f"      • 有Robots Meta: {'✅' if metrics.get('has_robots_meta') else '❌'}")
        print(f"      • Open Graph标签: {metrics.get('og_tags_count', 0)}个")
        print(f"      • Twitter Card标签: {metrics.get('twitter_tags_count', 0)}个")
        
        print(f"    语义化HTML:")
        semantic_elements = metrics.get('semantic_elements_list', [])
        if semantic_elements:
            print(f"      • 使用的语义元素: {', '.join(semantic_elements)}")
        else:
            print(f"      • 未使用语义元素")
    
    # 生成报告
    print(f"\n📄 生成详细报告...")
    report_paths = await checker.generate_reports(report)
    
    for path in report_paths:
        print(f"  ✅ 报告已保存: {path}")
    
    # 显示优先级建议
    if report.priority_matrix:
        print(f"\n🎯 优先改进建议:")
        for i, rec in enumerate(report.priority_matrix[:3], 1):
            priority_icon = "🔥" if rec.priority.value == "high" else "🟡" if rec.priority.value == "medium" else "🟢"
            print(f"  {i}. {priority_icon} {rec.title}")
            print(f"     优先级: {rec.priority.value} | 预估时间: {rec.estimated_hours}小时")
    
    print(f"\n✅ URL分析完成！")
    print("=" * 50)


async def analyze_custom_url(url: str):
    """分析自定义URL"""
    print(f"🔍 分析自定义URL: {url}")
    
    # 创建配置
    config = HealthCheckConfig()
    config.target_url = url
    config.verbose_logging = False
    config.report.output_directory = "reports"
    
    # 创建检查器
    checker = HealthChecker(config)
    checker.register_module(HTMLModule(ModuleConfig()))
    checker.register_report_generator(JSONReportGenerator(config.report))
    
    try:
        # 运行分析
        report = await checker.run_health_check()
        
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
    # 可以直接运行这个文件进行URL分析
    import sys
    
    if len(sys.argv) > 1:
        # 如果提供了URL参数，分析该URL
        url = sys.argv[1]
        asyncio.run(analyze_custom_url(url))
    else:
        # 否则运行示例
        asyncio.run(run_url_analysis_example())