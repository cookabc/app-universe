"""
Tests for base classes and data models.
"""

import pytest
from datetime import datetime
from unittest.mock import AsyncMock

from health_check.core.base import (
    Priority, Effort, Impact, Severity,
    Issue, Recommendation, AssessmentResult, HealthCheckReport,
    AssessmentModule, ReportGenerator
)
from health_check.core.config import ModuleConfig


class TestDataModels:
    """Test cases for data model classes."""
    
    def test_issue_creation(self):
        """Test Issue data model."""
        issue = Issue(
            id="test-issue-1",
            type="html_validation",
            severity=Severity.ERROR,
            message="Missing alt attribute",
            location={"file": "index.html", "line": 42},
            rule="img-alt",
            fix_suggestion="Add alt attribute to image"
        )
        
        assert issue.id == "test-issue-1"
        assert issue.severity == Severity.ERROR
        assert issue.location["line"] == 42
        assert "alt attribute" in issue.fix_suggestion
    
    def test_recommendation_creation(self):
        """Test Recommendation data model."""
        rec = Recommendation(
            id="rec-1",
            title="Optimize Images",
            description="Compress and resize images",
            category="performance",
            priority=Priority.HIGH,
            effort=Effort.MEDIUM,
            impact=Impact.HIGH,
            estimated_hours=4.0,
            implementation_steps=["Audit images", "Compress files"],
            resources=["ImageOptim tool"],
            dependencies=["rec-2"]
        )
        
        assert rec.priority == Priority.HIGH
        assert rec.estimated_hours == 4.0
        assert len(rec.implementation_steps) == 2
        assert "rec-2" in rec.dependencies
    
    def test_assessment_result(self):
        """Test AssessmentResult data model."""
        result = AssessmentResult(
            module_name="test_module",
            score=85.5,
            execution_time=12.3
        )
        
        # Test adding issues
        issue = Issue("i1", "test", Severity.WARNING, "Test issue")
        result.add_issue(issue)
        assert len(result.issues) == 1
        
        # Test adding recommendations
        rec = Recommendation("r1", "Test", "Desc", "cat", Priority.LOW, Effort.LOW, Impact.LOW, 1.0)
        result.add_recommendation(rec)
        assert len(result.recommendations) == 1
        
        # Test filtering
        warnings = result.get_issues_by_severity(Severity.WARNING)
        assert len(warnings) == 1
        
        low_priority = result.get_recommendations_by_priority(Priority.LOW)
        assert len(low_priority) == 1
    
    def test_health_check_report(self):
        """Test HealthCheckReport data model."""
        report = HealthCheckReport(
            assessment_id="test-123",
            timestamp=datetime.now(),
            website_url="https://example.com"
        )
        
        # Test adding module results
        result1 = AssessmentResult("module1", 80.0)
        result2 = AssessmentResult("module2", 90.0)
        
        report.add_module_result(result1)
        report.add_module_result(result2)
        
        assert len(report.modules) == 2
        assert report.overall_score == 85.0  # Average of 80 and 90
        
        # Test getting all issues and recommendations
        issue = Issue("i1", "test", Severity.ERROR, "Test")
        rec = Recommendation("r1", "Test", "Desc", "cat", Priority.HIGH, Effort.LOW, Impact.HIGH, 2.0)
        
        result1.add_issue(issue)
        result2.add_recommendation(rec)
        
        all_issues = report.get_all_issues()
        all_recs = report.get_all_recommendations()
        
        assert len(all_issues) == 1
        assert len(all_recs) == 1
    
    def test_priority_matrix_generation(self):
        """Test priority matrix generation."""
        report = HealthCheckReport("test", datetime.now(), "https://example.com")
        
        # Create recommendations with different priority scores
        rec1 = Recommendation("r1", "High Impact, Low Effort", "Desc", "cat", 
                            Priority.HIGH, Effort.LOW, Impact.HIGH, 1.0)
        rec2 = Recommendation("r2", "Low Impact, High Effort", "Desc", "cat",
                            Priority.LOW, Effort.HIGH, Impact.LOW, 8.0)
        rec3 = Recommendation("r3", "Medium Impact, Medium Effort", "Desc", "cat",
                            Priority.MEDIUM, Effort.MEDIUM, Impact.MEDIUM, 4.0)
        
        result = AssessmentResult("test_module", 75.0)
        result.add_recommendation(rec1)
        result.add_recommendation(rec2)
        result.add_recommendation(rec3)
        
        report.add_module_result(result)
        report.generate_priority_matrix()
        
        # High impact, low effort should be first
        assert report.priority_matrix[0].id == "r1"
        # Low impact, high effort should be last
        assert report.priority_matrix[-1].id == "r2"


class MockAssessmentModule(AssessmentModule):
    """Mock assessment module for testing."""
    
    async def assess(self, target_url: str) -> AssessmentResult:
        """Mock assessment implementation."""
        result = AssessmentResult(self.name, 75.0)
        
        issue = self.create_issue(
            "test_issue", 
            Severity.WARNING, 
            "Test issue found"
        )
        result.add_issue(issue)
        
        rec = self.create_recommendation(
            "Test Recommendation",
            "Fix the test issue",
            "testing",
            Priority.MEDIUM,
            Effort.LOW,
            Impact.MEDIUM,
            2.0
        )
        result.add_recommendation(rec)
        
        return result
    
    def get_module_info(self) -> dict:
        """Return module information."""
        return {
            "name": self.name,
            "description": "Mock module for testing",
            "version": "1.0.0"
        }


class MockReportGenerator(ReportGenerator):
    """Mock report generator for testing."""
    
    def generate(self, report: HealthCheckReport) -> str:
        """Mock report generation."""
        return f"mock_report_{report.assessment_id}.html"
    
    def get_supported_formats(self) -> list:
        """Return supported formats."""
        return ["html", "json"]


class TestBaseClasses:
    """Test cases for base classes."""
    
    def test_assessment_module(self):
        """Test AssessmentModule base class."""
        config = ModuleConfig(enabled=True, timeout=120)
        module = MockAssessmentModule(config)
        
        assert module.name == "mockassessment"
        assert module.is_enabled() is True
        assert module.get_timeout() == 120
        
        # Test helper methods
        issue = module.create_issue("test", Severity.ERROR, "Test message")
        assert issue.type == "test"
        assert issue.severity == Severity.ERROR
        
        rec = module.create_recommendation(
            "Test", "Description", "category",
            Priority.HIGH, Effort.LOW, Impact.HIGH, 3.0
        )
        assert rec.title == "Test"
        assert rec.priority == Priority.HIGH
    
    @pytest.mark.asyncio
    async def test_assessment_module_assess(self):
        """Test assessment module assess method."""
        config = ModuleConfig()
        module = MockAssessmentModule(config)
        
        result = await module.assess("https://example.com")
        
        assert result.module_name == "mockassessment"
        assert result.score == 75.0
        assert len(result.issues) == 1
        assert len(result.recommendations) == 1
        
        info = module.get_module_info()
        assert info["name"] == "mockassessment"
    
    def test_report_generator(self):
        """Test ReportGenerator base class."""
        from health_check.core.config import ReportConfig
        
        config = ReportConfig(
            output_directory="test_reports",
            include_screenshots=False,
            detailed_recommendations=True
        )
        
        generator = MockReportGenerator(config)
        
        assert generator.get_output_directory() == "test_reports"
        assert generator.should_include_screenshots() is False
        assert generator.should_include_detailed_recommendations() is True
        assert "html" in generator.get_supported_formats()
        
        # Test report generation
        report = HealthCheckReport("test-123", datetime.now(), "https://example.com")
        report_path = generator.generate(report)
        assert "mock_report_test-123.html" == report_path