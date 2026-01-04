"""
Command-line interface for the health check system.
"""

import argparse
import asyncio
import sys
from pathlib import Path
from typing import Optional

from .core.config import HealthCheckConfig
from .health_checker import HealthChecker


def create_parser() -> argparse.ArgumentParser:
    """Create command-line argument parser."""
    parser = argparse.ArgumentParser(
        description="Website Health Check System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  health_check https://example.com
  health_check --config config.yaml https://example.com
  health_check --output-dir ./reports https://example.com
        """
    )
    
    parser.add_argument(
        'url',
        nargs='?',
        help='Target URL to analyze'
    )
    
    parser.add_argument(
        '--config', '-c',
        type=str,
        help='Path to configuration file (YAML or JSON)'
    )
    
    parser.add_argument(
        '--output-dir', '-o',
        type=str,
        help='Output directory for reports'
    )
    
    parser.add_argument(
        '--format', '-f',
        choices=['html', 'json', 'csv'],
        action='append',
        help='Output format(s) for reports'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    parser.add_argument(
        '--modules', '-m',
        type=str,
        help='Comma-separated list of modules to run (default: all enabled)'
    )
    
    parser.add_argument(
        '--timeout', '-t',
        type=int,
        default=300,
        help='Timeout for individual assessments in seconds (default: 300)'
    )
    
    return parser


async def run_health_check(config: HealthCheckConfig, target_url: str) -> int:
    """Run the health check and return exit code."""
    try:
        # Create health checker
        checker = HealthChecker(config)
        
        # TODO: Register modules and report generators
        # This will be implemented in subsequent tasks
        
        # Validate configuration
        errors = checker.validate_configuration()
        if errors:
            print("Configuration errors:")
            for error in errors:
                print(f"  - {error}")
            return 1
        
        # Run health check
        report = await checker.run_health_check(target_url)
        
        # Generate reports
        report_paths = await checker.generate_reports(report)
        
        # Print summary
        print(f"\nHealth Check Complete!")
        print(f"Overall Score: {report.overall_score:.1f}/100")
        print(f"Assessment ID: {report.assessment_id}")
        
        if report_paths:
            print(f"\nReports generated:")
            for path in report_paths:
                print(f"  - {path}")
        
        return 0
        
    except Exception as e:
        print(f"Error: {e}")
        return 1


def main() -> int:
    """Main CLI entry point."""
    parser = create_parser()
    args = parser.parse_args()
    
    # Load configuration
    try:
        if args.config:
            config = HealthCheckConfig.from_file(args.config)
        else:
            config = HealthCheckConfig.from_env()
    except Exception as e:
        print(f"Configuration error: {e}")
        return 1
    
    # Override config with command-line arguments
    if args.url:
        config.target_url = args.url
    
    if args.output_dir:
        config.report.output_directory = args.output_dir
    
    if args.format:
        config.report.output_format = args.format
    
    if args.verbose:
        config.verbose_logging = True
    
    if args.timeout:
        # Apply timeout to all modules
        config.static_analysis.timeout = args.timeout
        config.performance.timeout = args.timeout
        config.security.timeout = args.timeout
        config.accessibility.timeout = args.timeout
        config.seo.timeout = args.timeout
    
    # Validate required arguments
    if not config.target_url:
        print("Error: Target URL is required")
        parser.print_help()
        return 1
    
    # Run health check
    return asyncio.run(run_health_check(config, config.target_url))


if __name__ == '__main__':
    sys.exit(main())