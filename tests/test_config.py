"""
Tests for configuration system.
"""

import pytest
import tempfile
import json
import yaml
from pathlib import Path

from health_check.core.config import (
    HealthCheckConfig, 
    ModuleConfig, 
    PerformanceConfig,
    SecurityConfig,
    AccessibilityConfig,
    SEOConfig,
    ReportConfig
)


class TestHealthCheckConfig:
    """Test cases for HealthCheckConfig."""
    
    def test_default_config(self):
        """Test default configuration values."""
        config = HealthCheckConfig()
        
        assert config.target_url == ""
        assert config.user_agent == "HealthCheck/1.0"
        assert config.max_concurrent_assessments == 5
        assert config.request_timeout == 30
        assert config.retry_attempts == 3
        assert config.verbose_logging is False
        
        # Test module configs
        assert config.static_analysis.enabled is True
        assert config.performance.mobile_test is True
        assert config.accessibility.wcag_level == "AA"
        assert config.report.output_format == ["html", "json"]
    
    def test_from_dict(self):
        """Test creating config from dictionary."""
        data = {
            "target_url": "https://example.com",
            "verbose_logging": True,
            "performance": {
                "page_speed_api_key": "test-key",
                "mobile_test": False
            },
            "accessibility": {
                "wcag_level": "AAA"
            }
        }
        
        config = HealthCheckConfig.from_dict(data)
        
        assert config.target_url == "https://example.com"
        assert config.verbose_logging is True
        assert config.performance.page_speed_api_key == "test-key"
        assert config.performance.mobile_test is False
        assert config.accessibility.wcag_level == "AAA"
    
    def test_from_json_file(self):
        """Test loading config from JSON file."""
        data = {
            "target_url": "https://test.com",
            "max_concurrent_assessments": 10,
            "security": {
                "vulnerability_scan_depth": "deep"
            }
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(data, f)
            temp_path = f.name
        
        try:
            config = HealthCheckConfig.from_file(temp_path)
            assert config.target_url == "https://test.com"
            assert config.max_concurrent_assessments == 10
            assert config.security.vulnerability_scan_depth == "deep"
        finally:
            Path(temp_path).unlink()
    
    def test_from_yaml_file(self):
        """Test loading config from YAML file."""
        data = {
            "target_url": "https://yaml-test.com",
            "verbose_logging": True,
            "report": {
                "output_format": ["html", "csv"],
                "include_screenshots": False
            }
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump(data, f)
            temp_path = f.name
        
        try:
            config = HealthCheckConfig.from_file(temp_path)
            assert config.target_url == "https://yaml-test.com"
            assert config.verbose_logging is True
            assert config.report.output_format == ["html", "csv"]
            assert config.report.include_screenshots is False
        finally:
            Path(temp_path).unlink()
    
    def test_validation(self):
        """Test configuration validation."""
        config = HealthCheckConfig()
        
        # Valid config should have no errors
        config.target_url = "https://example.com"
        errors = config.validate()
        assert len(errors) == 0
        
        # Invalid config should have errors
        config.target_url = ""
        config.max_concurrent_assessments = 0
        config.accessibility.wcag_level = "INVALID"
        config.report.output_format = ["invalid_format"]
        
        errors = config.validate()
        assert len(errors) > 0
        assert any("target_url is required" in error for error in errors)
        assert any("max_concurrent_assessments must be at least 1" in error for error in errors)
        assert any("wcag_level must be" in error for error in errors)
        assert any("Invalid output format" in error for error in errors)
    
    def test_to_dict(self):
        """Test converting config to dictionary."""
        config = HealthCheckConfig()
        config.target_url = "https://example.com"
        config.performance.page_speed_api_key = "test-key"
        
        data = config.to_dict()
        
        assert data["target_url"] == "https://example.com"
        assert data["performance"]["page_speed_api_key"] == "test-key"
        assert "static_analysis" in data
        assert "report" in data
    
    def test_save_to_file(self):
        """Test saving config to file."""
        config = HealthCheckConfig()
        config.target_url = "https://save-test.com"
        
        with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as f:
            temp_path = f.name
        
        try:
            config.save_to_file(temp_path)
            
            # Load and verify
            loaded_config = HealthCheckConfig.from_file(temp_path)
            assert loaded_config.target_url == "https://save-test.com"
        finally:
            Path(temp_path).unlink()


class TestModuleConfigs:
    """Test cases for module-specific configurations."""
    
    def test_module_config(self):
        """Test base ModuleConfig."""
        config = ModuleConfig(enabled=False, timeout=600)
        
        assert config.enabled is False
        assert config.timeout == 600
        assert isinstance(config.parameters, dict)
    
    def test_performance_config(self):
        """Test PerformanceConfig."""
        config = PerformanceConfig(
            page_speed_api_key="test-key",
            test_locations=["London:Chrome", "Sydney:Firefox"]
        )
        
        assert config.page_speed_api_key == "test-key"
        assert len(config.test_locations) == 2
        assert config.mobile_test is True  # default
    
    def test_security_config(self):
        """Test SecurityConfig."""
        config = SecurityConfig(
            vulnerability_scan_depth="deep",
            check_dependencies=False
        )
        
        assert config.vulnerability_scan_depth == "deep"
        assert config.check_dependencies is False
    
    def test_accessibility_config(self):
        """Test AccessibilityConfig."""
        config = AccessibilityConfig(
            wcag_level="AAA",
            color_contrast_threshold=7.0
        )
        
        assert config.wcag_level == "AAA"
        assert config.color_contrast_threshold == 7.0
    
    def test_seo_config(self):
        """Test SEOConfig."""
        config = SEOConfig(
            check_structured_data=False,
            analyze_social_tags=False
        )
        
        assert config.check_structured_data is False
        assert config.analyze_social_tags is False
    
    def test_report_config(self):
        """Test ReportConfig."""
        config = ReportConfig(
            output_format=["pdf"],
            output_directory="custom_reports",
            include_screenshots=False
        )
        
        assert config.output_format == ["pdf"]
        assert config.output_directory == "custom_reports"
        assert config.include_screenshots is False