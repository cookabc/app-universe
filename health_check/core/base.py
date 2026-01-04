"""
Base classes for assessment modules and report generation.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


class Priority(Enum):
    """Priority levels for recommendations."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Effort(Enum):
    """Effort levels for implementing recommendations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Impact(Enum):
    """Impact levels for recommendations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Severity(Enum):
    """Severity levels for issues."""
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


@dataclass
class Issue:
    """Represents an issue found during assessment."""
    id: str
    type: str
    severity: Severity
    message: str
    location: Optional[Dict[str, Any]] = None
    rule: Optional[str] = None
    fix_suggestion: Optional[str] = None


@dataclass
class Recommendation:
    """Represents a recommendation for improvement."""
    id: str
    title: str
    description: str
    category: str
    priority: Priority
    effort: Effort
    impact: Impact
    estimated_hours: float
    implementation_steps: List[str] = field(default_factory=list)
    resources: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)


@dataclass
class AssessmentResult:
    """Results from an assessment module."""
    module_name: str
    score: float  # 0-100
    issues: List[Issue] = field(default_factory=list)
    recommendations: List[Recommendation] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    execution_time: float = 0.0
    timestamp: datetime = field(default_factory=datetime.now)
    
    def add_issue(self, issue: Issue) -> None:
        """Add an issue to the assessment result."""
        self.issues.append(issue)
    
    def add_recommendation(self, recommendation: Recommendation) -> None:
        """Add a recommendation to the assessment result."""
        self.recommendations.append(recommendation)
    
    def get_issues_by_severity(self, severity: Severity) -> List[Issue]:
        """Get issues filtered by severity level."""
        return [issue for issue in self.issues if issue.severity == severity]
    
    def get_recommendations_by_priority(self, priority: Priority) -> List[Recommendation]:
        """Get recommendations filtered by priority level."""
        return [rec for rec in self.recommendations if rec.priority == priority]


@dataclass
class HealthCheckReport:
    """Complete health check report."""
    assessment_id: str
    timestamp: datetime
    website_url: str
    modules: Dict[str, AssessmentResult] = field(default_factory=dict)
    overall_score: float = 0.0
    priority_matrix: List[Recommendation] = field(default_factory=list)
    
    def add_module_result(self, result: AssessmentResult) -> None:
        """Add a module assessment result."""
        self.modules[result.module_name] = result
        self._calculate_overall_score()
    
    def _calculate_overall_score(self) -> None:
        """Calculate overall score based on module scores."""
        if not self.modules:
            self.overall_score = 0.0
            return
        
        total_score = sum(result.score for result in self.modules.values())
        self.overall_score = total_score / len(self.modules)
    
    def get_all_issues(self) -> List[Issue]:
        """Get all issues from all modules."""
        all_issues = []
        for result in self.modules.values():
            all_issues.extend(result.issues)
        return all_issues
    
    def get_all_recommendations(self) -> List[Recommendation]:
        """Get all recommendations from all modules."""
        all_recommendations = []
        for result in self.modules.values():
            all_recommendations.extend(result.recommendations)
        return all_recommendations
    
    def generate_priority_matrix(self) -> None:
        """Generate priority matrix based on impact vs effort."""
        all_recommendations = self.get_all_recommendations()
        
        # Sort by priority score (impact/effort ratio)
        def priority_score(rec: Recommendation) -> float:
            impact_values = {Impact.LOW: 1, Impact.MEDIUM: 2, Impact.HIGH: 3}
            effort_values = {Effort.LOW: 1, Effort.MEDIUM: 2, Effort.HIGH: 3}
            
            impact_score = impact_values[rec.impact]
            effort_score = effort_values[rec.effort]
            
            # Higher impact and lower effort = higher priority
            return impact_score / effort_score
        
        self.priority_matrix = sorted(all_recommendations, key=priority_score, reverse=True)


class AssessmentModule(ABC):
    """Base class for all assessment modules."""
    
    def __init__(self, config: Any):
        """Initialize the assessment module with configuration."""
        self.config = config
        self.name = self.__class__.__name__.replace('Module', '').lower()
    
    @abstractmethod
    async def assess(self, target_url: str) -> AssessmentResult:
        """
        Perform assessment on the target URL.
        
        Args:
            target_url: The URL to assess
            
        Returns:
            AssessmentResult containing findings and recommendations
        """
        pass
    
    @abstractmethod
    def get_module_info(self) -> Dict[str, Any]:
        """
        Get information about this module.
        
        Returns:
            Dictionary containing module metadata
        """
        pass
    
    def is_enabled(self) -> bool:
        """Check if this module is enabled in configuration."""
        return getattr(self.config, 'enabled', True)
    
    def get_timeout(self) -> int:
        """Get timeout value for this module."""
        return getattr(self.config, 'timeout', 300)
    
    def create_issue(self, issue_type: str, severity: Severity, message: str, 
                    location: Optional[Dict[str, Any]] = None, 
                    rule: Optional[str] = None,
                    fix_suggestion: Optional[str] = None) -> Issue:
        """Helper method to create an Issue object."""
        issue_id = f"{self.name}_{issue_type}_{len(message)}"
        return Issue(
            id=issue_id,
            type=issue_type,
            severity=severity,
            message=message,
            location=location,
            rule=rule,
            fix_suggestion=fix_suggestion
        )
    
    def create_recommendation(self, title: str, description: str, category: str,
                            priority: Priority, effort: Effort, impact: Impact,
                            estimated_hours: float,
                            implementation_steps: Optional[List[str]] = None,
                            resources: Optional[List[str]] = None,
                            dependencies: Optional[List[str]] = None) -> Recommendation:
        """Helper method to create a Recommendation object."""
        rec_id = f"{self.name}_{title.lower().replace(' ', '_')}"
        return Recommendation(
            id=rec_id,
            title=title,
            description=description,
            category=category,
            priority=priority,
            effort=effort,
            impact=impact,
            estimated_hours=estimated_hours,
            implementation_steps=implementation_steps or [],
            resources=resources or [],
            dependencies=dependencies or []
        )


class ReportGenerator(ABC):
    """Base class for report generators."""
    
    def __init__(self, config: Any):
        """Initialize the report generator with configuration."""
        self.config = config
    
    @abstractmethod
    def generate(self, report: HealthCheckReport) -> str:
        """
        Generate a report from the health check results.
        
        Args:
            report: The HealthCheckReport to generate from
            
        Returns:
            String path to the generated report file
        """
        pass
    
    @abstractmethod
    def get_supported_formats(self) -> List[str]:
        """
        Get list of supported output formats.
        
        Returns:
            List of supported format strings
        """
        pass
    
    def get_output_directory(self) -> str:
        """Get the configured output directory."""
        return getattr(self.config, 'output_directory', 'reports')
    
    def should_include_screenshots(self) -> bool:
        """Check if screenshots should be included in reports."""
        return getattr(self.config, 'include_screenshots', True)
    
    def should_include_detailed_recommendations(self) -> bool:
        """Check if detailed recommendations should be included."""
        return getattr(self.config, 'detailed_recommendations', True)