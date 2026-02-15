"""
Source code analysis base classes and utilities.
"""

import os
import fnmatch
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Set, Union
from pathlib import Path
from dataclasses import dataclass, field

from .base import AssessmentModule, AssessmentResult, Priority, Effort, Impact, Severity


@dataclass
class SourceFile:
    """Represents a source file for analysis."""
    path: Path
    relative_path: Path
    content: str
    size: int
    extension: str
    encoding: str = "utf-8"
    
    @classmethod
    def from_path(cls, file_path: Path, project_root: Path) -> 'SourceFile':
        """Create SourceFile from file path."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            encoding = 'utf-8'
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as f:
                    content = f.read()
                encoding = 'latin-1'
            except Exception:
                content = ""
                encoding = 'unknown'
        
        return cls(
            path=file_path,
            relative_path=file_path.relative_to(project_root),
            content=content,
            size=len(content),
            extension=file_path.suffix.lower(),
            encoding=encoding
        )


@dataclass
class ProjectStructure:
    """Represents the structure of a source code project."""
    root_path: Path
    files: List[SourceFile] = field(default_factory=list)
    directories: List[Path] = field(default_factory=list)
    total_files: int = 0
    total_size: int = 0
    file_types: Dict[str, int] = field(default_factory=dict)
    
    def add_file(self, source_file: SourceFile) -> None:
        """Add a source file to the project structure."""
        self.files.append(source_file)
        self.total_files += 1
        self.total_size += source_file.size
        
        ext = source_file.extension
        self.file_types[ext] = self.file_types.get(ext, 0) + 1
    
    def get_files_by_extension(self, extension: str) -> List[SourceFile]:
        """Get all files with a specific extension."""
        return [f for f in self.files if f.extension == extension]
    
    def get_files_by_pattern(self, pattern: str) -> List[SourceFile]:
        """Get files matching a glob pattern."""
        return [f for f in self.files if fnmatch.fnmatch(str(f.relative_path), pattern)]


class SourceCodeScanner:
    """Scans source code directories and builds project structure."""
    
    DEFAULT_IGNORE_PATTERNS = {
        # Version control
        '.git', '.svn', '.hg', '.bzr',
        # Dependencies
        'node_modules', 'vendor', '.venv', 'venv', '__pycache__',
        # Build outputs
        'dist', 'build', 'target', 'out', '.next', '.nuxt',
        # IDE files
        '.vscode', '.idea', '*.swp', '*.swo',
        # OS files
        '.DS_Store', 'Thumbs.db',
        # Logs and temp
        '*.log', '*.tmp', '.cache'
    }
    
    DEFAULT_INCLUDE_EXTENSIONS = {
        # Web files
        '.html', '.htm', '.css', '.scss', '.sass', '.less',
        '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
        # Server-side
        '.py', '.php', '.rb', '.java', '.cs', '.go', '.rs',
        # Config files
        '.json', '.yaml', '.yml', '.toml', '.ini', '.env',
        # Documentation
        '.md', '.rst', '.txt',
        # Templates
        '.jinja', '.j2', '.twig', '.blade.php'
    }
    
    def __init__(self, 
                 ignore_patterns: Optional[Set[str]] = None,
                 include_extensions: Optional[Set[str]] = None,
                 max_file_size: int = 1024 * 1024):  # 1MB default
        """Initialize source code scanner."""
        self.ignore_patterns = ignore_patterns or self.DEFAULT_IGNORE_PATTERNS
        self.include_extensions = include_extensions or self.DEFAULT_INCLUDE_EXTENSIONS
        self.max_file_size = max_file_size
    
    def scan_directory(self, directory_path: Union[str, Path]) -> ProjectStructure:
        """Scan a directory and return project structure."""
        root_path = Path(directory_path).resolve()
        
        if not root_path.exists() or not root_path.is_dir():
            raise ValueError(f"Directory does not exist: {root_path}")
        
        project = ProjectStructure(root_path=root_path)
        
        for file_path in self._walk_directory(root_path):
            if self._should_include_file(file_path, root_path):
                try:
                    source_file = SourceFile.from_path(file_path, root_path)
                    project.add_file(source_file)
                except Exception as e:
                    # Log error but continue scanning
                    print(f"Warning: Could not process file {file_path}: {e}")
        
        return project
    
    def _walk_directory(self, root_path: Path):
        """Walk directory tree, yielding file paths."""
        for current_dir, dirs, files in os.walk(root_path):
            current_path = Path(current_dir)
            
            # Filter out ignored directories
            dirs[:] = [d for d in dirs if not self._is_ignored(d)]
            
            for file_name in files:
                file_path = current_path / file_name
                if not self._is_ignored(file_name):
                    yield file_path
    
    def _should_include_file(self, file_path: Path, root_path: Path) -> bool:
        """Check if file should be included in analysis."""
        # Check file extension
        if file_path.suffix.lower() not in self.include_extensions:
            return False
        
        # Check file size
        try:
            if file_path.stat().st_size > self.max_file_size:
                return False
        except OSError:
            return False
        
        # Check if any part of the path is ignored
        relative_path = file_path.relative_to(root_path)
        for part in relative_path.parts:
            if self._is_ignored(part):
                return False
        
        return True
    
    def _is_ignored(self, name: str) -> bool:
        """Check if a file or directory name should be ignored."""
        for pattern in self.ignore_patterns:
            if fnmatch.fnmatch(name, pattern):
                return True
        return False


class SourceCodeAssessmentModule(AssessmentModule):
    """Base class for source code assessment modules."""
    
    def __init__(self, config: Any):
        """Initialize source code assessment module."""
        super().__init__(config)
        self.scanner = SourceCodeScanner()
    
    async def assess(self, target: str) -> AssessmentResult:
        """
        Assess source code. Target can be a directory path or URL.
        
        Args:
            target: Directory path for source code analysis
            
        Returns:
            AssessmentResult containing findings
        """
        # Check if target is a directory path
        target_path = Path(target)
        if target_path.exists() and target_path.is_dir():
            return await self.assess_source_code(target_path)
        else:
            # Fallback to URL-based assessment if implemented
            return await self.assess_url(target)
    
    @abstractmethod
    async def assess_source_code(self, directory_path: Path) -> AssessmentResult:
        """
        Perform source code assessment on a directory.
        
        Args:
            directory_path: Path to the source code directory
            
        Returns:
            AssessmentResult containing source code analysis findings
        """
        pass
    
    async def assess_url(self, target_url: str) -> AssessmentResult:
        """
        Fallback URL assessment (can be overridden by subclasses).
        
        Args:
            target_url: URL to assess
            
        Returns:
            AssessmentResult indicating source code analysis not available for URLs
        """
        result = AssessmentResult(self.name, 0.0)
        
        issue = self.create_issue(
            "source_code_not_available",
            Severity.INFO,
            "源码分析不适用于URL，请提供源码目录路径",
            fix_suggestion="使用本地源码目录路径进行分析"
        )
        result.add_issue(issue)
        
        return result
    
    def _analyze_project_structure(self, project: ProjectStructure) -> Dict[str, Any]:
        """Analyze project structure and return metrics."""
        return {
            "total_files": project.total_files,
            "total_size_bytes": project.total_size,
            "total_size_mb": round(project.total_size / (1024 * 1024), 2),
            "file_types": dict(project.file_types),
            "largest_files": self._get_largest_files(project.files),
            "directory_structure_depth": self._calculate_max_depth(project.root_path),
        }
    
    def _get_largest_files(self, files: List[SourceFile], limit: int = 5) -> List[Dict[str, Any]]:
        """Get the largest files in the project."""
        sorted_files = sorted(files, key=lambda f: f.size, reverse=True)
        return [
            {
                "path": str(f.relative_path),
                "size_bytes": f.size,
                "size_kb": round(f.size / 1024, 1)
            }
            for f in sorted_files[:limit]
        ]
    
    def _calculate_max_depth(self, root_path: Path) -> int:
        """Calculate maximum directory depth."""
        max_depth = 0
        for current_dir, dirs, files in os.walk(root_path):
            current_path = Path(current_dir)
            try:
                depth = len(current_path.relative_to(root_path).parts)
                max_depth = max(max_depth, depth)
            except ValueError:
                continue
        return max_depth