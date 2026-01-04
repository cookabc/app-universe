"""
Tests for source code HTML analysis module.
"""

import pytest
import tempfile
from pathlib import Path
from unittest.mock import patch

from health_check.core.config import ModuleConfig
from health_check.core.base import Severity
from health_check.modules.source_html_module import SourceHTMLModule


class TestSourceHTMLModule:
    """Test cases for SourceHTMLModule."""
    
    def test_source_html_module_creation(self):
        """Test SourceHTMLModule creation."""
        config = ModuleConfig()
        module = SourceHTMLModule(config)
        
        assert module.name == "sourcehtml"
        info = module.get_module_info()
        assert info["analysis_type"] == "source_code"
        assert ".html" in info["supported_files"]
        assert len(info["checks"]) > 5
    
    @pytest.mark.asyncio
    async def test_assess_good_html_project(self):
        """Test assessment of a well-structured HTML project."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project_dir = Path(temp_dir)
            
            # Create a good HTML file
            good_html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>优秀的网页示例 - 完整的HTML结构</title>
    <meta name="description" content="这是一个结构良好的HTML页面示例，包含了所有必要的SEO和可访问性元素。">
</head>
<body>
    <header>
        <nav>
            <h1>网站标题</h1>
        </nav>
    </header>
    <main>
        <article>
            <h1>页面主标题</h1>
            <p>内容</p>
            <img src="test.jpg" alt="测试图片">
            <form>
                <label for="name">姓名:</label>
                <input type="text" id="name">
            </form>
        </article>
    </main>
    <footer>
        <p>版权信息</p>
    </footer>
</body>
</html>"""
            
            (project_dir / "index.html").write_text(good_html, encoding='utf-8')
            
            config = ModuleConfig()
            module = SourceHTMLModule(config)
            
            result = await module.assess_source_code(project_dir)
            
            # Should have high score for good HTML
            assert result.score > 80
            assert result.module_name == "sourcehtml"
            
            # Check metrics
            metrics = result.metrics
            assert metrics["html_files_count"] == 1
            assert metrics["total_files"] >= 1
            assert metrics["files_with_h1"] == 1
            assert metrics["files_with_meta_description"] == 1
            assert metrics["files_with_viewport"] == 1
            assert metrics["alt_attribute_coverage"] == 100.0
            
            # Should have minimal issues
            assert len(result.issues) <= 3
    
    @pytest.mark.asyncio
    async def test_assess_problematic_html_project(self):
        """Test assessment of a problematic HTML project."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project_dir = Path(temp_dir)
            
            # Create problematic HTML files
            bad_html1 = """<html>
<head>
    <title>短</title>
</head>
<body>
    <h1>标题1</h1>
    <h1>标题2</h1>
    <img src="test1.jpg">
    <img src="test2.jpg">
    <form>
        <input type="text">
        <input type="email">
    </form>
    <!-- TODO: 需要完成 -->
    <script src="script.js"></script>
</body>
</html>"""
            
            bad_html2 = """<html>
<body>
    <p>最小内容</p>
</body>
</html>"""
            
            (project_dir / "bad1.html").write_text(bad_html1, encoding='utf-8')
            (project_dir / "bad2.html").write_text(bad_html2, encoding='utf-8')
            
            config = ModuleConfig()
            module = SourceHTMLModule(config)
            
            result = await module.assess_source_code(project_dir)
            
            # Should have lower score due to issues
            assert result.score < 60
            
            # Check for expected issues
            issue_types = [issue.type for issue in result.issues]
            
            # Should detect multiple problems
            assert "multiple_h1" in issue_types
            assert "missing_alt_attributes" in issue_types
            assert "title_too_short" in issue_types
            assert "missing_form_labels" in issue_types
            
            # Should have recommendations
            assert len(result.recommendations) > 0
            
            # Check metrics
            metrics = result.metrics
            assert metrics["html_files_count"] == 2
            assert metrics["files_with_issues"] == 2
            assert metrics["alt_attribute_coverage"] == 0.0  # No alt attributes
    
    @pytest.mark.asyncio
    async def test_assess_no_html_files(self):
        """Test assessment of project with no HTML files."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project_dir = Path(temp_dir)
            
            # Create non-HTML files
            (project_dir / "style.css").write_text("body { margin: 0; }", encoding='utf-8')
            (project_dir / "script.js").write_text("console.log('test');", encoding='utf-8')
            (project_dir / "README.md").write_text("# Project", encoding='utf-8')
            
            config = ModuleConfig()
            module = SourceHTMLModule(config)
            
            result = await module.assess_source_code(project_dir)
            
            # Should have zero score
            assert result.score == 0.0
            
            # Should have info issue about no HTML files
            assert len(result.issues) == 1
            assert result.issues[0].type == "no_html_files"
            assert result.issues[0].severity == Severity.INFO
            
            # Should still have project metrics
            metrics = result.metrics
            assert metrics["total_files"] == 3
            assert metrics["html_files_count"] == 0
    
    @pytest.mark.asyncio
    async def test_assess_mixed_quality_project(self):
        """Test assessment of project with mixed quality HTML files."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project_dir = Path(temp_dir)
            
            # Create subdirectory
            (project_dir / "pages").mkdir()
            
            # Good HTML file
            good_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Good Page Title</title>
    <meta name="description" content="A good page with proper structure and SEO elements.">
</head>
<body>
    <h1>Main Title</h1>
    <img src="image.jpg" alt="Description">
</body>
</html>"""
            
            # Bad HTML file
            bad_html = """<html>
<head><title>Bad</title></head>
<body>
    <img src="no-alt.jpg">
    <form><input type="text"></form>
</body>
</html>"""
            
            (project_dir / "good.html").write_text(good_html, encoding='utf-8')
            (project_dir / "pages" / "bad.html").write_text(bad_html, encoding='utf-8')
            
            config = ModuleConfig()
            module = SourceHTMLModule(config)
            
            result = await module.assess_source_code(project_dir)
            
            # Should have moderate score (average of good and bad)
            assert 30 < result.score < 80
            
            # Should have issues from bad file
            assert len(result.issues) > 0
            
            # Should have recommendations
            assert len(result.recommendations) > 0
            
            # Check metrics
            metrics = result.metrics
            assert metrics["html_files_count"] == 2
            assert metrics["files_with_h1"] == 1  # Only good file has H1
            assert metrics["files_with_meta_description"] == 1  # Only good file
            assert metrics["total_images_all_files"] == 2
            assert metrics["total_images_without_alt"] == 1
            assert metrics["alt_attribute_coverage"] == 50.0
    
    @pytest.mark.asyncio
    async def test_assess_invalid_directory(self):
        """Test assessment of invalid directory."""
        config = ModuleConfig()
        module = SourceHTMLModule(config)
        
        # Test with non-existent directory
        with pytest.raises(ValueError):
            await module.assess_source_code(Path("/non/existent/directory"))
    
    @pytest.mark.asyncio
    async def test_assess_url_fallback(self):
        """Test URL assessment fallback."""
        config = ModuleConfig()
        module = SourceHTMLModule(config)
        
        result = await module.assess("https://example.com")
        
        # Should return info about source code not available
        assert result.score == 0.0
        assert len(result.issues) == 1
        assert result.issues[0].type == "source_code_not_available"
        assert result.issues[0].severity == Severity.INFO
    
    @pytest.mark.asyncio
    async def test_code_quality_checks(self):
        """Test code quality specific checks."""
        with tempfile.TemporaryDirectory() as temp_dir:
            project_dir = Path(temp_dir)
            
            # HTML with code quality issues
            quality_issues_html = """<!DOCTYPE html>
<html>
<head>
    <title>Code Quality Test</title>
</head>
<body>
    <h1>Title</h1>
    
    <!-- TODO: Add more content -->
    <!-- FIXME: Fix styling -->
    
    <div style="color: red;">Inline 1</div>
    <div style="color: blue;">Inline 2</div>
    <div style="color: green;">Inline 3</div>
    <div style="color: yellow;">Inline 4</div>
    <div style="color: purple;">Inline 5</div>
    <div style="color: orange;">Inline 6</div>
    
    <p>This is a very very very very very very very very very very very very very very very very very very very very very very long line that exceeds 120 characters.</p>
    
    <script src="blocking1.js"></script>
    <script src="blocking2.js"></script>
</body>
</html>"""
            
            (project_dir / "quality.html").write_text(quality_issues_html, encoding='utf-8')
            
            config = ModuleConfig()
            module = SourceHTMLModule(config)
            
            result = await module.assess_source_code(project_dir)
            
            # Check for code quality issues
            issue_types = [issue.type for issue in result.issues]
            
            assert "todo_comments" in issue_types
            assert "excessive_inline_styles" in issue_types
            assert "long_lines" in issue_types
            assert "blocking_scripts" in issue_types
    
    def test_module_info(self):
        """Test module information."""
        config = ModuleConfig()
        module = SourceHTMLModule(config)
        
        info = module.get_module_info()
        
        assert info["name"] == "sourcehtml"
        assert info["description"] == "源码HTML结构和质量分析"
        assert info["version"] == "1.0.0"
        assert info["analysis_type"] == "source_code"
        assert ".html" in info["supported_files"]
        assert ".htm" in info["supported_files"]
        assert isinstance(info["checks"], list)
        assert len(info["checks"]) > 5