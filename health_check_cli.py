#!/usr/bin/env python3
"""
网站健康检查工具 - 命令行界面

这个工具提供了多种网站分析功能：
1. URL分析 - 分析在线网站
2. 源码分析 - 分析本地HTML项目
"""

import asyncio
import sys
import argparse
from pathlib import Path


def show_menu():
    """显示功能菜单"""
    print("🚀 网站健康检查工具")
    print("=" * 50)
    print("请选择分析类型：")
    print()
    print("1. URL分析 - 分析在线网站")
    print("   • HTML结构和SEO分析")
    print("   • 生成JSON格式报告")
    print()
    print("2. 源码分析 - 分析本地HTML项目")
    print("   • 批量分析HTML文件")
    print("   • 项目级别统计")
    print("   • 文件级别问题定位")
    print()
    print("3. 退出")
    print()


async def run_url_analysis():
    """运行URL分析"""
    print("🌐 启动URL分析...")
    print()
    
    try:
        from examples.url_analysis import run_url_analysis_example
        await run_url_analysis_example()
    except ImportError as e:
        print(f"❌ 无法导入URL分析模块: {e}")
    except Exception as e:
        print(f"❌ URL分析运行出错: {e}")


async def run_source_analysis():
    """运行源码分析"""
    print("📁 启动源码分析...")
    print()
    
    try:
        from examples.source_analysis import run_source_analysis_example
        await run_source_analysis_example()
    except ImportError as e:
        print(f"❌ 无法导入源码分析模块: {e}")
    except Exception as e:
        print(f"❌ 源码分析运行出错: {e}")


async def interactive_mode():
    """交互模式"""
    while True:
        show_menu()
        
        try:
            choice = input("请输入选择 (1-3): ").strip()
            print()
            
            if choice == "1":
                await run_url_analysis()
            elif choice == "2":
                await run_source_analysis()
            elif choice == "3":
                print("👋 感谢使用网站健康检查工具！")
                break
            else:
                print("❌ 无效选择，请输入 1-3")
                continue
                
            print("\n" + "=" * 50)
            input("按回车键返回主菜单...")
            print()
            
        except KeyboardInterrupt:
            print("\n\n👋 感谢使用网站健康检查工具！")
            break
        except Exception as e:
            print(f"❌ 运行出错: {e}")
            print("\n" + "=" * 50)
            input("按回车键返回主菜单...")
            print()


async def analyze_url(url: str, output_dir: str = "reports"):
    """分析指定URL"""
    print(f"🌐 分析URL: {url}")
    
    from health_check.core.config import HealthCheckConfig, ModuleConfig
    from health_check.health_checker import HealthChecker
    from health_check.modules.html_module import HTMLModule
    from health_check.reports.json_generator import JSONReportGenerator
    
    # 创建配置
    config = HealthCheckConfig()
    config.target_url = url
    config.report.output_directory = output_dir
    
    # 创建检查器
    checker = HealthChecker(config)
    checker.register_module(HTMLModule(ModuleConfig()))
    checker.register_report_generator(JSONReportGenerator(config.report))
    
    # 运行分析
    report = await checker.run_health_check()
    
    # 生成报告
    report_paths = await checker.generate_reports(report)
    
    print(f"✅ 分析完成，总体得分: {report.overall_score:.1f}/100")
    for path in report_paths:
        print(f"📄 报告已保存: {path}")


async def analyze_source(directory: str, output_dir: str = "reports"):
    """分析指定源码目录"""
    print(f"📁 分析源码目录: {directory}")
    
    from health_check.core.config import HealthCheckConfig, ModuleConfig
    from health_check.health_checker import HealthChecker
    from health_check.modules.source_html_module import SourceHTMLModule
    from health_check.reports.json_generator import JSONReportGenerator
    
    # 创建配置
    config = HealthCheckConfig()
    config.report.output_directory = output_dir
    
    # 创建检查器
    checker = HealthChecker(config)
    checker.register_module(SourceHTMLModule(ModuleConfig()))
    checker.register_report_generator(JSONReportGenerator(config.report))
    
    # 运行分析
    report = await checker.run_health_check(directory)
    
    # 生成报告
    report_paths = await checker.generate_reports(report)
    
    print(f"✅ 分析完成，总体得分: {report.overall_score:.1f}/100")
    for path in report_paths:
        print(f"📄 报告已保存: {path}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description="网站健康检查工具 - 分析网站HTML结构、SEO和可访问性",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  %(prog)s                                    # 交互模式
  %(prog)s --url https://example.com          # 分析URL
  %(prog)s --source ./my-website              # 分析源码目录
  %(prog)s --url https://example.com --output ./reports  # 指定输出目录
        """
    )
    
    parser.add_argument(
        "--url", 
        help="要分析的网站URL"
    )
    
    parser.add_argument(
        "--source", 
        help="要分析的源码目录路径"
    )
    
    parser.add_argument(
        "--output", 
        default="reports",
        help="报告输出目录 (默认: reports)"
    )
    
    parser.add_argument(
        "--version", 
        action="version", 
        version="网站健康检查工具 v0.1.0"
    )
    
    args = parser.parse_args()
    
    # 如果没有提供参数，进入交互模式
    if not args.url and not args.source:
        asyncio.run(interactive_mode())
        return
    
    # 命令行模式
    if args.url and args.source:
        print("❌ 错误: 不能同时指定 --url 和 --source")
        sys.exit(1)
    
    try:
        if args.url:
            asyncio.run(analyze_url(args.url, args.output))
        elif args.source:
            if not Path(args.source).exists():
                print(f"❌ 错误: 目录不存在: {args.source}")
                sys.exit(1)
            asyncio.run(analyze_source(args.source, args.output))
    except KeyboardInterrupt:
        print("\n👋 分析已取消")
    except Exception as e:
        print(f"❌ 分析失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()