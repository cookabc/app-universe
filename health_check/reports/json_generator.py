"""
JSON report generator for health check results.
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, List

from ..core.base import ReportGenerator, HealthCheckReport, Issue, Recommendation


class JSONReportGenerator(ReportGenerator):
    """Generate JSON format reports from health check results."""
    
    def generate(self, report: HealthCheckReport) -> str:
        """
        Generate a JSON report from the health check results.
        
        Args:
            report: The HealthCheckReport to generate from
            
        Returns:
            String path to the generated JSON report file
        """
        output_dir = self.get_output_directory()
        os.makedirs(output_dir, exist_ok=True)
        
        report_path = os.path.join(output_dir, f"health_report_{report.assessment_id}.json")
        
        # Convert report to JSON-serializable format
        report_data = self._convert_report_to_dict(report)
        
        # Write JSON file with proper formatting
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False, default=self._json_serializer)
        
        return report_path
    
    def get_supported_formats(self) -> List[str]:
        """Return list of supported output formats."""
        return ["json"]
    
    def _convert_report_to_dict(self, report: HealthCheckReport) -> Dict[str, Any]:
        """Convert HealthCheckReport to dictionary format."""
        return {
            "assessment_id": report.assessment_id,
            "timestamp": report.timestamp.isoformat(),
            "website_url": report.website_url,
            "overall_score": round(report.overall_score, 1),
            "modules": {
                name: self._convert_assessment_result_to_dict(result)
                for name, result in report.modules.items()
            },
            "priority_matrix": [
                self._convert_recommendation_to_dict(rec)
                for rec in report.priority_matrix
            ],
            "summary": self._generate_summary(report)
        }
    
    def _convert_assessment_result_to_dict(self, result) -> Dict[str, Any]:
        """Convert AssessmentResult to dictionary format."""
        return {
            "score": round(result.score, 1),
            "execution_time": round(result.execution_time, 3),
            "issues": [
                self._convert_issue_to_dict(issue)
                for issue in result.issues
            ],
            "recommendations": [
                self._convert_recommendation_to_dict(rec)
                for rec in result.recommendations
            ],
            "metrics": result.metrics
        }
    
    def _convert_issue_to_dict(self, issue: Issue) -> Dict[str, Any]:
        """Convert Issue to dictionary format."""
        return {
            "id": issue.id,
            "type": issue.type,
            "severity": issue.severity.value,
            "message": issue.message,
            "location": issue.location,
            "rule": issue.rule,
            "fix_suggestion": issue.fix_suggestion
        }
    
    def _convert_recommendation_to_dict(self, recommendation: Recommendation) -> Dict[str, Any]:
        """Convert Recommendation to dictionary format."""
        return {
            "id": recommendation.id,
            "title": recommendation.title,
            "description": recommendation.description,
            "category": recommendation.category,
            "priority": recommendation.priority.value,
            "effort": recommendation.effort.value,
            "impact": recommendation.impact.value,
            "estimated_hours": recommendation.estimated_hours,
            "implementation_steps": recommendation.implementation_steps,
            "resources": recommendation.resources,
            "dependencies": recommendation.dependencies
        }
    
    def _generate_summary(self, report: HealthCheckReport) -> Dict[str, Any]:
        """Generate summary statistics for the report."""
        all_issues = report.get_all_issues()
        all_recommendations = report.get_all_recommendations()
        
        # Count issues by severity
        issue_counts = {
            "error": len([i for i in all_issues if i.severity.value == "error"]),
            "warning": len([i for i in all_issues if i.severity.value == "warning"]),
            "info": len([i for i in all_issues if i.severity.value == "info"])
        }
        
        # Count recommendations by priority
        recommendation_counts = {
            "critical": len([r for r in all_recommendations if r.priority.value == "critical"]),
            "high": len([r for r in all_recommendations if r.priority.value == "high"]),
            "medium": len([r for r in all_recommendations if r.priority.value == "medium"]),
            "low": len([r for r in all_recommendations if r.priority.value == "low"])
        }
        
        # Calculate total estimated work
        total_estimated_hours = sum(rec.estimated_hours for rec in all_recommendations)
        
        # Module scores
        module_scores = {
            name: round(result.score, 1)
            for name, result in report.modules.items()
        }
        
        return {
            "total_issues": len(all_issues),
            "total_recommendations": len(all_recommendations),
            "total_estimated_hours": round(total_estimated_hours, 1),
            "issue_breakdown": issue_counts,
            "recommendation_breakdown": recommendation_counts,
            "module_scores": module_scores,
            "modules_count": len(report.modules),
            "assessment_duration": self._calculate_total_duration(report)
        }
    
    def _calculate_total_duration(self, report: HealthCheckReport) -> float:
        """Calculate total assessment duration in seconds."""
        return round(sum(result.execution_time for result in report.modules.values()), 2)
    
    def _json_serializer(self, obj):
        """Custom JSON serializer for datetime and other objects."""
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")