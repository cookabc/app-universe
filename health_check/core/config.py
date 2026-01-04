"""
Configuration system for health check parameters.
"""

import os
import json
import yaml
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ModuleConfig:
    """Configuration for individual assessment modules."""
    enabled: bool = True
    timeout: int = 300  # seconds
    parameters: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PerformanceConfig(ModuleConfig):
    """Configuration for performance testing module."""
    page_speed_api_key: Optional[str] = None
    gtmetrix_api_key: Optional[str] = None
    webpagetest_api_key: Optional[str] = None
    test_locations: List[str] = field(default_factory=lambda: ["Dulles:Chrome"])
    mobile_test: bool = True


@dataclass
class SecurityConfig(ModuleConfig):
    """Configuration for security assessment module."""
    ssl_labs_api_key: Optional[str] = None
    vulnerability_scan_depth: str = "medium"  # light, medium, deep
    check_dependencies: bool = True


@dataclass
class AccessibilityConfig(ModuleConfig):
    """Configuration for accessibility evaluation module."""
    wcag_level: str = "AA"  # A, AA, AAA
    wcag_version: str = "2.1"
    color_contrast_threshold: float = 4.5


@dataclass
class SEOConfig(ModuleConfig):
    """Configuration for SEO analysis module."""
    google_search_console_key: Optional[str] = None
    check_structured_data: bool = True
    analyze_social_tags: bool = True


@dataclass
class ReportConfig:
    """Configuration for report generation."""
    output_format: List[str] = field(default_factory=lambda: ["html", "json"])
    output_directory: str = "reports"
    include_screenshots: bool = True
    detailed_recommendations: bool = True


@dataclass
class HealthCheckConfig:
    """Main configuration class for the health check system."""
    
    # Target website configuration
    target_url: str = ""
    user_agent: str = "HealthCheck/1.0"
    
    # Module configurations
    static_analysis: ModuleConfig = field(default_factory=ModuleConfig)
    performance: PerformanceConfig = field(default_factory=PerformanceConfig)
    security: SecurityConfig = field(default_factory=SecurityConfig)
    accessibility: AccessibilityConfig = field(default_factory=AccessibilityConfig)
    seo: SEOConfig = field(default_factory=SEOConfig)
    
    # Report configuration
    report: ReportConfig = field(default_factory=ReportConfig)
    
    # Global settings
    max_concurrent_assessments: int = 5
    request_timeout: int = 30
    retry_attempts: int = 3
    verbose_logging: bool = False
    
    @classmethod
    def from_file(cls, config_path: str) -> 'HealthCheckConfig':
        """Load configuration from a file (JSON or YAML)."""
        config_path = Path(config_path)
        
        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")
        
        with open(config_path, 'r', encoding='utf-8') as f:
            if config_path.suffix.lower() in ['.yml', '.yaml']:
                data = yaml.safe_load(f)
            elif config_path.suffix.lower() == '.json':
                data = json.load(f)
            else:
                raise ValueError(f"Unsupported configuration file format: {config_path.suffix}")
        
        return cls.from_dict(data)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'HealthCheckConfig':
        """Create configuration from dictionary."""
        config = cls()
        
        # Update basic fields
        for key, value in data.items():
            if hasattr(config, key) and not isinstance(getattr(config, key), (ModuleConfig, ReportConfig)):
                setattr(config, key, value)
        
        # Update module configurations
        if 'static_analysis' in data:
            config.static_analysis = ModuleConfig(**data['static_analysis'])
        
        if 'performance' in data:
            config.performance = PerformanceConfig(**data['performance'])
        
        if 'security' in data:
            config.security = SecurityConfig(**data['security'])
        
        if 'accessibility' in data:
            config.accessibility = AccessibilityConfig(**data['accessibility'])
        
        if 'seo' in data:
            config.seo = SEOConfig(**data['seo'])
        
        if 'report' in data:
            config.report = ReportConfig(**data['report'])
        
        return config
    
    @classmethod
    def from_env(cls) -> 'HealthCheckConfig':
        """Create configuration from environment variables."""
        config = cls()
        
        # Load from environment variables with HC_ prefix
        config.target_url = os.getenv('HC_TARGET_URL', config.target_url)
        config.verbose_logging = os.getenv('HC_VERBOSE', 'false').lower() == 'true'
        
        # API keys from environment
        if os.getenv('HC_PAGESPEED_API_KEY'):
            config.performance.page_speed_api_key = os.getenv('HC_PAGESPEED_API_KEY')
        
        if os.getenv('HC_GTMETRIX_API_KEY'):
            config.performance.gtmetrix_api_key = os.getenv('HC_GTMETRIX_API_KEY')
        
        if os.getenv('HC_SSL_LABS_API_KEY'):
            config.security.ssl_labs_api_key = os.getenv('HC_SSL_LABS_API_KEY')
        
        if os.getenv('HC_GOOGLE_SEARCH_CONSOLE_KEY'):
            config.seo.google_search_console_key = os.getenv('HC_GOOGLE_SEARCH_CONSOLE_KEY')
        
        return config
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        result = {}
        
        # Basic fields
        for key, value in self.__dict__.items():
            if not isinstance(value, (ModuleConfig, ReportConfig)):
                result[key] = value
        
        # Module configurations
        result['static_analysis'] = self.static_analysis.__dict__
        result['performance'] = self.performance.__dict__
        result['security'] = self.security.__dict__
        result['accessibility'] = self.accessibility.__dict__
        result['seo'] = self.seo.__dict__
        result['report'] = self.report.__dict__
        
        return result
    
    def save_to_file(self, config_path: str) -> None:
        """Save configuration to a file."""
        config_path = Path(config_path)
        config_path.parent.mkdir(parents=True, exist_ok=True)
        
        data = self.to_dict()
        
        with open(config_path, 'w', encoding='utf-8') as f:
            if config_path.suffix.lower() in ['.yml', '.yaml']:
                yaml.dump(data, f, default_flow_style=False, indent=2)
            elif config_path.suffix.lower() == '.json':
                json.dump(data, f, indent=2)
            else:
                raise ValueError(f"Unsupported configuration file format: {config_path.suffix}")
    
    def validate(self) -> List[str]:
        """Validate configuration and return list of errors."""
        errors = []
        
        if not self.target_url:
            errors.append("target_url is required")
        
        if self.max_concurrent_assessments < 1:
            errors.append("max_concurrent_assessments must be at least 1")
        
        if self.request_timeout < 1:
            errors.append("request_timeout must be at least 1 second")
        
        if self.retry_attempts < 0:
            errors.append("retry_attempts cannot be negative")
        
        # Validate WCAG level
        if self.accessibility.wcag_level not in ['A', 'AA', 'AAA']:
            errors.append("accessibility.wcag_level must be 'A', 'AA', or 'AAA'")
        
        # Validate output formats
        valid_formats = ['html', 'json', 'csv', 'pdf']
        for fmt in self.report.output_format:
            if fmt not in valid_formats:
                errors.append(f"Invalid output format: {fmt}. Valid formats: {valid_formats}")
        
        return errors