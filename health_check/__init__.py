"""
Project Health Check System

A comprehensive website analysis tool for evaluating code quality,
performance, security, accessibility, and maintainability.
"""

__version__ = "0.1.0"
__author__ = "Health Check System"

from .core.config import HealthCheckConfig
from .core.base import AssessmentModule, ReportGenerator
from .health_checker import HealthChecker

__all__ = [
    "HealthCheckConfig",
    "AssessmentModule", 
    "ReportGenerator",
    "HealthChecker"
]