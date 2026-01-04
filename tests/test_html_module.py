"""
Tests for enhanced HTML module.
"""

import pytest
from unittest.mock import patch, Mock
from datetime import datetime

from health_check.core.config import ModuleConfig
from health_check.core.base import Severity, Priority
from health_check.modules.html_module import HTMLModule


class TestHTMLModule:
    """Test cases for HTMLModule."""
    
    def test_html_module_creation(self):
        """Test HTMLModule creation."""
        config = ModuleConfig()
        module = HTMLModule(config)
        
        assert module.name == "html"
        info = module.get_module_info()
        assert info["name"] == "html"
        assert info["version"] == "2.0.0"
        assert len(info["checks"]) > 5
    
    @pytest.mark.asyncio
    async def test_assess_complete_html_page(self):
        """Test assessment of a complete HTML page."""
        html_content = """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>完整的测试页面标题，包含足够的字符</title>
            <meta name="description" content="这是一个完整的测试页面描述，长度适中，符合SEO要求，包含足够的字符数量来满足搜索引擎优化的基本需求。">
            <link rel="canonical" href="https://example.com/test">
            <meta property="og:title" content="测试页面">
            <meta property="og:description" content="测试描述">
            <meta property="og:image" content="https://example.com/image.jpg">
            <meta property="og:url" content="https://example.com/test">
            <meta name="twitter:card" content="summary">
        </head>
        <body>
            <header>
                <nav>导航</nav>
            </header>
            <main>
                <h1>主标题</h1>
                <article>
                    <h2>副标题</h2>
                    <p>页面内容</p>
                    <img src="test.jpg" alt="测试图片">
                    <form>
                        <label for="test-input">测试输入:</label>
                        <input type="text" id="test-input">
                    </form>
                </article>
            </main>
            <footer>页脚</footer>
        </body>
        </html>
        """
        
        mock_response = Mock()
        mock_response.content = html_content.encode('utf-8')
        mock_response.raise_for_status.return_value = None
        
        with patch('requests.get', return_value=mock_response):
            config = ModuleConfig()
            module = HTMLModule(config)
            
            result = await module.assess("https://example.com/test")
            
            # Should have high score for complete page
            assert result.score >= 90
            assert result.module_name == "html"
            
            # Check metrics
            metrics = result.metrics
            assert metrics["has_doctype"] is True
            assert metrics["has_title"] is True
            assert metrics["has_meta_description"] is True
            assert metrics["has_lang_attribute"] is True
            assert metrics["has_charset"] is True
            assert metrics["has_viewport"] is True
            assert metrics["h1_count"] == 1
            assert metrics["semantic_elements_used"] >= 4
            assert metrics["og_tags_count"] == 4
            assert metrics["twitter_tags_count"] == 1
            
            # Should have minimal issues
            assert len(result.issues) <= 2  # Maybe some minor info issues
    
    @pytest.mark.asyncio
    async def test_assess_problematic_html_page(self):
        """Test assessment of a problematic HTML page."""
        html_content = """
        <html>
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
            <script src="external.js"></script>
        </body>
        </html>
        """
        
        mock_response = Mock()
        mock_response.content = html_content.encode('utf-8')
        mock_response.raise_for_status.return_value = None
        
        with patch('requests.get', return_value=mock_response):
            config = ModuleConfig()
            module = HTMLModule(config)
            
            result = await module.assess("https://example.com/test")
            
            # Should have lower score due to issues
            assert result.score < 70
            
            # Check for expected issues
            issue_types = [issue.type for issue in result.issues]
            
            # Should detect multiple H1s
            assert "multiple_h1" in issue_types
            
            # Should detect missing alt attributes
            assert "missing_alt_attributes" in issue_types
            
            # Should detect missing meta description
            assert "missing_meta_description" in issue_types
            
            # Should detect short title
            assert "title_too_short" in issue_types
            
            # Should detect missing form labels
            assert "missing_form_labels" in issue_types
            
            # Should detect missing lang attribute
            assert "missing_lang_attribute" in issue_types
            
            # Should detect missing viewport
            assert "missing_viewport_meta" in issue_types
            
            # Should have recommendations
            assert len(result.recommendations) > 0
            
            # Check metrics
            metrics = result.metrics
            assert metrics["h1_count"] == 2
            assert metrics["images_without_alt"] == 2
            assert metrics["has_meta_description"] is False
            assert metrics["has_lang_attribute"] is False
            assert metrics["has_viewport"] is False
    
    @pytest.mark.asyncio
    async def test_assess_minimal_html_page(self):
        """Test assessment of a minimal HTML page."""
        html_content = """
        <html>
        <head></head>
        <body></body>
        </html>
        """
        
        mock_response = Mock()
        mock_response.content = html_content.encode('utf-8')
        mock_response.raise_for_status.return_value = None
        
        with patch('requests.get', return_value=mock_response):
            config = ModuleConfig()
            module = HTMLModule(config)
            
            result = await module.assess("https://example.com/test")
            
            # Should have very low score
            assert result.score < 50
            
            # Should have many issues
            assert len(result.issues) > 5
            
            # Check for critical issues
            issue_types = [issue.type for issue in result.issues]
            assert "missing_title" in issue_types
            assert "missing_h1" in issue_types
            assert "missing_meta_description" in issue_types
            
            # Should have recommendations
            assert len(result.recommendations) > 0
    
    @pytest.mark.asyncio
    async def test_assess_seo_optimized_page(self):
        """Test assessment of an SEO-optimized page."""
        html_content = """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>这是一个长度适中的SEO优化标题，包含关键词</title>
            <meta name="description" content="这是一个长度适中的meta描述，包含了页面的主要内容和关键词，有助于搜索引擎理解页面内容，并且字符数量符合SEO最佳实践要求。">
            <link rel="canonical" href="https://example.com/seo-page">
            <meta name="robots" content="index,follow">
            
            <!-- Open Graph tags -->
            <meta property="og:title" content="SEO优化页面">
            <meta property="og:description" content="SEO优化页面描述">
            <meta property="og:image" content="https://example.com/og-image.jpg">
            <meta property="og:url" content="https://example.com/seo-page">
            <meta property="og:type" content="website">
            
            <!-- Twitter Card tags -->
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="SEO优化页面">
            <meta name="twitter:description" content="SEO优化页面描述">
            <meta name="twitter:image" content="https://example.com/twitter-image.jpg">
        </head>
        <body>
            <header>
                <nav>
                    <a href="/">首页</a>
                    <a href="/about">关于</a>
                </nav>
            </header>
            <main>
                <article>
                    <h1>主要标题</h1>
                    <h2>副标题</h2>
                    <p>内容段落</p>
                    <img src="content-image.jpg" alt="内容相关图片">
                    <section>
                        <h3>小节标题</h3>
                        <p>小节内容</p>
                    </section>
                </article>
            </main>
            <aside>
                <h2>侧边栏</h2>
                <p>侧边栏内容</p>
            </aside>
            <footer>
                <p>版权信息</p>
            </footer>
        </body>
        </html>
        """
        
        mock_response = Mock()
        mock_response.content = html_content.encode('utf-8')
        mock_response.raise_for_status.return_value = None
        
        with patch('requests.get', return_value=mock_response):
            config = ModuleConfig()
            module = HTMLModule(config)
            
            result = await module.assess("https://example.com/seo-page")
            
            # Should have very high score
            assert result.score >= 95
            
            # Should have minimal or no issues
            assert len(result.issues) <= 1
            
            # Check SEO metrics
            metrics = result.metrics
            assert metrics["has_doctype"] is True
            assert metrics["has_title"] is True
            assert metrics["title_length"] > 10
            assert metrics["has_meta_description"] is True
            assert metrics["has_canonical"] is True
            assert metrics["has_robots_meta"] is True
            assert metrics["og_tags_count"] >= 4
            assert metrics["twitter_tags_count"] >= 4
            assert metrics["semantic_elements_used"] >= 5
            assert metrics["h1_count"] == 1
            assert metrics["images_without_alt"] == 0
    
    @pytest.mark.asyncio
    async def test_assess_network_error(self):
        """Test assessment when network error occurs."""
        with patch('requests.get', side_effect=Exception("Network error")):
            config = ModuleConfig()
            module = HTMLModule(config)
            
            result = await module.assess("https://example.com/test")
            
            # Should have zero score due to error
            assert result.score == 0.0
            
            # Should have error issue
            assert len(result.issues) == 1
            assert result.issues[0].severity == Severity.ERROR
            assert result.issues[0].type == "analysis_error"
            assert "Network error" in result.issues[0].message
    
    def test_module_info(self):
        """Test module information."""
        config = ModuleConfig()
        module = HTMLModule(config)
        
        info = module.get_module_info()
        
        assert info["name"] == "html"
        assert info["description"] == "增强的HTML结构和SEO分析"
        assert info["version"] == "2.0.0"
        assert isinstance(info["checks"], list)
        assert len(info["checks"]) > 5
        
        # Check that all expected check types are included
        checks_str = " ".join(info["checks"])
        assert "HTML5" in checks_str
        assert "SEO" in checks_str
        assert "可访问性" in checks_str