"""
Tests for JSON report generator.
"""

import pytest
import json
import tempfile
import os
from datetime import datetime
from pathlib import Path

from health_check.core.base import (
    HealthCheckReport, AssessmentResult, Issue, Recommendation,
    Priority, Effort, Impact, Severity
)
from health_check.core.config import ReportConfig
from health_check.reports.json_generator import JSONReportGenerator


class TestJSONReportGenerator:
    """Test cases for JSONReportGenerator."""
    
    def test_json_generator_creation(self):
        """Test JSONReportGenerator creation."""
        config = ReportConfig(output_directory="test_reports")
        generator = JSONReportGenerator(config)
        
        assert generator.get_output_directory() == "test_reports"
        assert "json" in generator.get_supported_formats()
    
    def test_generate_simple_report(self):
        """Test generating a simple JSON report."""
        # Create test report
        report = HealthCheckReport(
            assessment_id="test-123",
            timestamp=datetime(2025, 1, 1, 12, 0, 0),
            website_url="https://example.com"
        )
        
        # Add a simple assessment result
        result = AssessmentResult("test_module", 85.5)
        result.execution_time = 1.23
        
        issue = Issue(
            id="test-issue-1",
            type="test_issue",
            severity=Severity.WARNING,
            message="Test issue message",
            fix_suggestion="Fix this issue"
        )
        result.add_issue(issue)
        
        recommendation = Recommendation(
            id="test-rec-1",
            title="Test Recommendation",
            description="Test recommendation description",
            category="testing",
            priority=Priority.HIGH,
            effort=Effort.LOW,
            impact=Impact.MEDIUM,
            estimated_hours=2.5
        )
        result.add_recommendation(recommendation)
        
        report.add_module_result(result)
        report.generate_priority_matrix()
        
        # Generate report
        with tempfile.TemporaryDirectory() as temp_dir:
            config = ReportConfig(output_directory=temp_dir)
            generator = JSONReportGenerator(config)
            
            report_path = generator.generate(report)
            
            # Verify file was created
            assert os.path.exists(report_path)
            assert report_path.endswith(".json")
            
            # Verify JSON content
            with open(report_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            assert data["assessment_id"] == "test-123"
            assert data["website_url"] == "https://example.com"
            assert data["overall_score"] == 85.5
            assert "2025-01-01T12:00:00" in data["timestamp"]
            
            # Check modules
            assert "test_module" in data["modules"]
            module_data = data["modules"]["test_module"]
            assert module_data["score"] == 85.5
            assert module_data["execution_time"] == 1.23
            
            # Check issues
            assert len(module_data["issues"]) == 1
            issue_data = module_data["issues"][0]
            assert issue_data["id"] == "test-issue-1"
            assert issue_data["severity"] == "warning"
            assert issue_data["message"] == "Test issue message"
            
            # Check recommendations
            assert len(module_data["recommendations"]) == 1
            rec_data = module_data["recommendations"][0]
            assert rec_data["title"] == "Test Recommendation"
            assert rec_data["priority"] == "high"
            assert rec_data["estimated_hours"] == 2.5
            
            # Check priority matrix
            assert len(data["priority_matrix"]) == 1
            assert data["priority_matrix"][0]["id"] == "test-rec-1"
    
    def test_generate_complex_report(self):
        """Test generating a complex report with multiple modules."""
        report = HealthCheckReport(
            assessment_id="complex-test",
            timestamp=datetime.now(),
            website_url="https://complex-example.com"
        )
        
        # Add multiple modules
        for i in range(3):
            result = AssessmentResult(f"module_{i}", 70.0 + i * 10)
            result.execution_time = 0.5 + i * 0.2
            
            # Add multiple issues
            for j in range(2):
                issue = Issue(
                    id=f"issue-{i}-{j}",
                    type=f"issue_type_{j}",
                    severity=Severity.ERROR if j == 0 else Severity.WARNING,
                    message=f"Issue {j} in module {i}",
                    fix_suggestion=f"Fix issue {j}"
                )
                result.add_issue(issue)
            
            # Add recommendations
            rec = Recommendation(
                id=f"rec-{i}",
                title=f"Recommendation {i}",
                description=f"Description for recommendation {i}",
                category="testing",
                priority=Priority.HIGH if i == 0 else Priority.MEDIUM,
                effort=Effort.LOW,
                impact=Impact.HIGH,
                estimated_hours=1.0 + i
            )
            result.add_recommendation(rec)
            
            result.metrics = {
                f"metric_{i}_1": i * 10,
                f"metric_{i}_2": f"value_{i}"
            }
            
            report.add_module_result(result)
        
        report.generate_priority_matrix()
        
        # Generate and verify report
        with tempfile.TemporaryDirectory() as temp_dir:
            config = ReportConfig(output_directory=temp_dir)
            generator = JSONReportGenerator(config)
            
            report_path = generator.generate(report)
            
            with open(report_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Verify structure
            assert len(data["modules"]) == 3
            assert len(data["priority_matrix"]) == 3
            
            # Check summary
            summary = data["summary"]
            assert summary["total_issues"] == 6  # 2 issues per module * 3 modules
            assert summary["total_recommendations"] == 3
            assert summary["modules_count"] == 3
            assert summary["total_estimated_hours"] == 6.0  # 1+2+3
            
            # Check issue breakdown
            assert summary["issue_breakdown"]["error"] == 3
            assert summary["issue_breakdown"]["warning"] == 3
            assert summary["issue_breakdown"]["info"] == 0
            
            # Check recommendation breakdown
            assert summary["recommendation_breakdown"]["high"] == 1
            assert summary["recommendation_breakdown"]["medium"] == 2
    
    def test_empty_report(self):
        """Test generating report with no modules."""
        report = HealthCheckReport(
            assessment_id="empty-test",
            timestamp=datetime.now(),
            website_url="https://empty-example.com"
        )
        
        with tempfile.TemporaryDirectory() as temp_dir:
            config = ReportConfig(output_directory=temp_dir)
            generator = JSONReportGenerator(config)
            
            report_path = generator.generate(report)
            
            with open(report_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            assert data["overall_score"] == 0.0
            assert len(data["modules"]) == 0
            assert len(data["priority_matrix"]) == 0
            assert data["summary"]["total_issues"] == 0
            assert data["summary"]["total_recommendations"] == 0
    
    def test_json_serialization_edge_cases(self):
        """Test JSON serialization of edge cases."""
        report = HealthCheckReport(
            assessment_id="edge-case-test",
            timestamp=datetime.now(),
            website_url="https://edge-case.com"
        )
        
        result = AssessmentResult("edge_module", 50.0)
        
        # Issue with None values
        issue = Issue(
            id="edge-issue",
            type="edge_type",
            severity=Severity.INFO,
            message="Edge case issue",
            location=None,  # None value
            rule=None,      # None value
            fix_suggestion=None  # None value
        )
        result.add_issue(issue)
        
        # Recommendation with empty lists
        rec = Recommendation(
            id="edge-rec",
            title="Edge Recommendation",
            description="Edge description",
            category="edge",
            priority=Priority.LOW,
            effort=Effort.HIGH,
            impact=Impact.LOW,
            estimated_hours=0.0,
            implementation_steps=[],  # Empty list
            resources=[],             # Empty list
            dependencies=[]           # Empty list
        )
        result.add_recommendation(rec)
        
        # Metrics with various data types
        result.metrics = {
            "string_metric": "test",
            "int_metric": 42,
            "float_metric": 3.14,
            "bool_metric": True,
            "none_metric": None,
            "list_metric": [1, 2, 3],
            "dict_metric": {"nested": "value"}
        }
        
        report.add_module_result(result)
        
        with tempfile.TemporaryDirectory() as temp_dir:
            config = ReportConfig(output_directory=temp_dir)
            generator = JSONReportGenerator(config)
            
            # Should not raise any exceptions
            report_path = generator.generate(report)
            
            # Verify valid JSON
            with open(report_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Verify None values are preserved
            issue_data = data["modules"]["edge_module"]["issues"][0]
            assert issue_data["location"] is None
            assert issue_data["rule"] is None
            assert issue_data["fix_suggestion"] is None
            
            # Verify empty lists are preserved
            rec_data = data["modules"]["edge_module"]["recommendations"][0]
            assert rec_data["implementation_steps"] == []
            assert rec_data["resources"] == []
            assert rec_data["dependencies"] == []
            
            # Verify various metric types
            metrics = data["modules"]["edge_module"]["metrics"]
            assert metrics["string_metric"] == "test"
            assert metrics["int_metric"] == 42
            assert metrics["float_metric"] == 3.14
            assert metrics["bool_metric"] is True
            assert metrics["none_metric"] is None
            assert metrics["list_metric"] == [1, 2, 3]
            assert metrics["dict_metric"] == {"nested": "value"}