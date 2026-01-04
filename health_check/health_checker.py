"""
Main HealthChecker class that orchestrates the health check process.
"""

import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from .core.config import HealthCheckConfig
from .core.base import AssessmentModule, ReportGenerator, HealthCheckReport


class HealthChecker:
    """Main class for orchestrating website health checks."""
    
    def __init__(self, config: HealthCheckConfig):
        """Initialize the health checker with configuration."""
        self.config = config
        self.modules: List[AssessmentModule] = []
        self.report_generators: List[ReportGenerator] = []
        self.logger = self._setup_logging()
    
    def _setup_logging(self) -> logging.Logger:
        """Set up logging configuration."""
        logger = logging.getLogger('health_check')
        
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        logger.setLevel(logging.DEBUG if self.config.verbose_logging else logging.INFO)
        return logger
    
    def register_module(self, module: AssessmentModule) -> None:
        """Register an assessment module."""
        if module.is_enabled():
            self.modules.append(module)
            self.logger.info(f"Registered module: {module.name}")
        else:
            self.logger.info(f"Module disabled: {module.name}")
    
    def register_report_generator(self, generator: ReportGenerator) -> None:
        """Register a report generator."""
        self.report_generators.append(generator)
        self.logger.info(f"Registered report generator: {generator.__class__.__name__}")
    
    async def run_health_check(self, target_url: Optional[str] = None) -> HealthCheckReport:
        """
        Run a complete health check on the target URL.
        
        Args:
            target_url: URL to check (uses config default if not provided)
            
        Returns:
            HealthCheckReport with all assessment results
        """
        url = target_url or self.config.target_url
        if not url:
            raise ValueError("No target URL provided")
        
        self.logger.info(f"Starting health check for: {url}")
        
        # Create report
        report = HealthCheckReport(
            assessment_id=str(uuid.uuid4()),
            timestamp=datetime.now(),
            website_url=url
        )
        
        # Run assessments
        await self._run_assessments(url, report)
        
        # Generate priority matrix
        report.generate_priority_matrix()
        
        self.logger.info(f"Health check completed. Overall score: {report.overall_score:.1f}")
        
        return report
    
    async def _run_assessments(self, url: str, report: HealthCheckReport) -> None:
        """Run all registered assessment modules."""
        if not self.modules:
            self.logger.warning("No assessment modules registered")
            return
        
        # Create semaphore to limit concurrent assessments
        semaphore = asyncio.Semaphore(self.config.max_concurrent_assessments)
        
        # Create tasks for all modules
        tasks = []
        for module in self.modules:
            task = self._run_single_assessment(semaphore, module, url, report)
            tasks.append(task)
        
        # Wait for all assessments to complete
        await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _run_single_assessment(self, semaphore: asyncio.Semaphore, 
                                   module: AssessmentModule, url: str, 
                                   report: HealthCheckReport) -> None:
        """Run a single assessment module."""
        async with semaphore:
            try:
                self.logger.info(f"Running assessment: {module.name}")
                start_time = datetime.now()
                
                # Run assessment with timeout
                result = await asyncio.wait_for(
                    module.assess(url),
                    timeout=module.get_timeout()
                )
                
                # Calculate execution time
                execution_time = (datetime.now() - start_time).total_seconds()
                result.execution_time = execution_time
                
                # Add result to report
                report.add_module_result(result)
                
                self.logger.info(
                    f"Completed assessment: {module.name} "
                    f"(score: {result.score:.1f}, time: {execution_time:.1f}s)"
                )
                
            except asyncio.TimeoutError:
                self.logger.error(f"Assessment timeout: {module.name}")
            except Exception as e:
                self.logger.error(f"Assessment failed: {module.name} - {str(e)}")
    
    async def generate_reports(self, report: HealthCheckReport) -> List[str]:
        """
        Generate reports using all registered report generators.
        
        Args:
            report: The HealthCheckReport to generate from
            
        Returns:
            List of paths to generated report files
        """
        if not self.report_generators:
            self.logger.warning("No report generators registered")
            return []
        
        report_paths = []
        
        for generator in self.report_generators:
            try:
                self.logger.info(f"Generating report: {generator.__class__.__name__}")
                path = generator.generate(report)
                report_paths.append(path)
                self.logger.info(f"Report generated: {path}")
            except Exception as e:
                self.logger.error(f"Report generation failed: {generator.__class__.__name__} - {str(e)}")
        
        return report_paths
    
    def get_module_info(self) -> Dict[str, Any]:
        """Get information about all registered modules."""
        return {
            module.name: module.get_module_info()
            for module in self.modules
        }
    
    def validate_configuration(self) -> List[str]:
        """Validate the current configuration."""
        return self.config.validate()