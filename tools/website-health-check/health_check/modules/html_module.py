"""
Enhanced HTML structure and SEO analysis module.
"""

import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Dict, Any, List, Optional

from ..core.base import AssessmentModule, AssessmentResult, Priority, Effort, Impact, Severity


class HTMLModule(AssessmentModule):
    """Enhanced HTML structure and SEO analysis module."""
    
    async def assess(self, target_url: str) -> AssessmentResult:
        """Perform comprehensive HTML and SEO analysis."""
        result = AssessmentResult(self.name, 0.0)
        
        try:
            # Fetch webpage content
            response = requests.get(target_url, timeout=10, headers={
                'User-Agent': 'Mozilla/5.0 (compatible; HealthCheck/1.0)'
            })
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            score = 100.0  # Starting score
            
            # Run all checks
            score = self._check_basic_html_structure(soup, result, score)
            score = self._check_seo_elements(soup, result, score)
            score = self._check_semantic_html(soup, result, score)
            score = self._check_accessibility_basics(soup, result, score)
            score = self._check_performance_hints(soup, result, score)
            score = self._check_social_media_tags(soup, result, score)
            
            # Set final score and metrics
            result.score = max(0, score)
            result.metrics = self._collect_metrics(soup, target_url)
            
        except Exception as e:
            issue = self.create_issue(
                "analysis_error",
                Severity.ERROR,
                f"HTML分析过程中出错: {str(e)}",
                fix_suggestion="检查网站是否可访问，确保URL正确"
            )
            result.add_issue(issue)
            result.score = 0.0
        
        return result
    
    def _check_basic_html_structure(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check basic HTML structure elements."""
        
        # Check DOCTYPE
        if not str(soup).strip().lower().startswith('<!doctype html>'):
            issue = self.create_issue(
                "missing_doctype",
                Severity.WARNING,
                "页面缺少HTML5 DOCTYPE声明",
                fix_suggestion="在页面顶部添加 <!DOCTYPE html>"
            )
            result.add_issue(issue)
            score -= 5
        
        # Check title tag
        title_tag = soup.find('title')
        if not title_tag:
            issue = self.create_issue(
                "missing_title",
                Severity.ERROR,
                "页面缺少 <title> 标签",
                fix_suggestion="添加描述性的 <title> 标签"
            )
            result.add_issue(issue)
            score -= 20
            
            rec = self.create_recommendation(
                "添加页面标题",
                "为页面添加描述性的标题标签，提高SEO和用户体验",
                "html_structure",
                Priority.HIGH,
                Effort.LOW,
                Impact.HIGH,
                0.5
            )
            result.add_recommendation(rec)
        else:
            title_text = title_tag.get_text().strip()
            if len(title_text) < 10:
                issue = self.create_issue(
                    "title_too_short",
                    Severity.WARNING,
                    f"页面标题过短 ({len(title_text)}字符)，建议10-60字符",
                    fix_suggestion="扩展标题内容，使其更具描述性"
                )
                result.add_issue(issue)
                score -= 5
            elif len(title_text) > 60:
                issue = self.create_issue(
                    "title_too_long",
                    Severity.WARNING,
                    f"页面标题过长 ({len(title_text)}字符)，建议10-60字符",
                    fix_suggestion="缩短标题长度，保持在60字符以内"
                )
                result.add_issue(issue)
                score -= 5
        
        # Check lang attribute
        html_tag = soup.find('html')
        if not html_tag or not html_tag.get('lang'):
            issue = self.create_issue(
                "missing_lang_attribute",
                Severity.WARNING,
                "HTML标签缺少lang属性",
                fix_suggestion="在<html>标签中添加lang属性，如 <html lang=\"zh-CN\">"
            )
            result.add_issue(issue)
            score -= 5
        
        return score
    
    def _check_seo_elements(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check SEO-related elements."""
        
        # Check meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc:
            issue = self.create_issue(
                "missing_meta_description",
                Severity.WARNING,
                "页面缺少meta description",
                fix_suggestion="添加meta description标签"
            )
            result.add_issue(issue)
            score -= 10
            
            rec = self.create_recommendation(
                "添加Meta描述",
                "添加meta description标签，提高搜索引擎可见性",
                "seo",
                Priority.MEDIUM,
                Effort.LOW,
                Impact.MEDIUM,
                0.25
            )
            result.add_recommendation(rec)
        else:
            desc_content = meta_desc.get('content', '').strip()
            if len(desc_content) < 50:
                issue = self.create_issue(
                    "meta_description_too_short",
                    Severity.WARNING,
                    f"Meta描述过短 ({len(desc_content)}字符)，建议50-160字符",
                    fix_suggestion="扩展meta描述内容"
                )
                result.add_issue(issue)
                score -= 5
            elif len(desc_content) > 160:
                issue = self.create_issue(
                    "meta_description_too_long",
                    Severity.WARNING,
                    f"Meta描述过长 ({len(desc_content)}字符)，建议50-160字符",
                    fix_suggestion="缩短meta描述长度"
                )
                result.add_issue(issue)
                score -= 5
        
        # Check meta keywords (deprecated but still check)
        meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
        if meta_keywords:
            issue = self.create_issue(
                "deprecated_meta_keywords",
                Severity.INFO,
                "发现已废弃的meta keywords标签",
                fix_suggestion="移除meta keywords标签，现代SEO不再使用"
            )
            result.add_issue(issue)
        
        # Check canonical URL
        canonical = soup.find('link', attrs={'rel': 'canonical'})
        if not canonical:
            issue = self.create_issue(
                "missing_canonical_url",
                Severity.INFO,
                "页面缺少canonical URL",
                fix_suggestion="添加canonical链接防止重复内容问题"
            )
            result.add_issue(issue)
            score -= 3
        
        # Check robots meta tag
        robots_meta = soup.find('meta', attrs={'name': 'robots'})
        if robots_meta:
            robots_content = robots_meta.get('content', '').lower()
            if 'noindex' in robots_content:
                issue = self.create_issue(
                    "noindex_detected",
                    Severity.WARNING,
                    "页面设置为noindex，搜索引擎不会索引",
                    fix_suggestion="如果希望被搜索引擎索引，移除noindex指令"
                )
                result.add_issue(issue)
                score -= 10
        
        return score
    
    def _check_semantic_html(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check HTML5 semantic elements usage."""
        
        # Check heading hierarchy
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        h1_count = len(soup.find_all('h1'))
        
        if h1_count == 0:
            issue = self.create_issue(
                "missing_h1",
                Severity.ERROR,
                "页面缺少H1标题",
                fix_suggestion="添加一个主要的H1标题"
            )
            result.add_issue(issue)
            score -= 15
        elif h1_count > 1:
            issue = self.create_issue(
                "multiple_h1",
                Severity.WARNING,
                f"页面有 {h1_count} 个H1标题，建议只有一个",
                fix_suggestion="确保页面只有一个主要的H1标题"
            )
            result.add_issue(issue)
            score -= 5
        
        # Check semantic HTML5 elements
        semantic_elements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']
        found_semantic = [elem for elem in semantic_elements if soup.find(elem)]
        
        if len(found_semantic) < 3:
            issue = self.create_issue(
                "limited_semantic_html",
                Severity.INFO,
                f"使用的HTML5语义元素较少 ({len(found_semantic)}/7)",
                fix_suggestion="考虑使用更多HTML5语义元素如header, nav, main, article等"
            )
            result.add_issue(issue)
            score -= 5
            
            rec = self.create_recommendation(
                "改善HTML5语义化",
                "使用更多HTML5语义元素提高页面结构和可访问性",
                "html_structure",
                Priority.LOW,
                Effort.MEDIUM,
                Impact.MEDIUM,
                2.0
            )
            result.add_recommendation(rec)
        
        return score
    
    def _check_accessibility_basics(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check basic accessibility elements."""
        
        # Check image alt attributes
        images = soup.find_all('img')
        images_without_alt = [img for img in images if not img.get('alt')]
        
        if images_without_alt:
            issue = self.create_issue(
                "missing_alt_attributes",
                Severity.WARNING,
                f"发现 {len(images_without_alt)} 个图片缺少alt属性",
                fix_suggestion="为所有图片添加描述性的alt属性"
            )
            result.add_issue(issue)
            score -= min(len(images_without_alt) * 2, 20)
            
            rec = self.create_recommendation(
                "添加图片Alt属性",
                "为所有图片添加alt属性，提高可访问性",
                "accessibility",
                Priority.MEDIUM,
                Effort.MEDIUM,
                Impact.HIGH,
                len(images_without_alt) * 0.1
            )
            result.add_recommendation(rec)
        
        # Check form labels
        inputs = soup.find_all(['input', 'textarea', 'select'])
        inputs_without_labels = []
        
        for input_elem in inputs:
            input_type = input_elem.get('type', 'text')
            if input_type in ['hidden', 'submit', 'button']:
                continue
                
            input_id = input_elem.get('id')
            has_label = False
            
            if input_id:
                label = soup.find('label', attrs={'for': input_id})
                if label:
                    has_label = True
            
            # Check for aria-label or aria-labelledby
            if not has_label:
                if input_elem.get('aria-label') or input_elem.get('aria-labelledby'):
                    has_label = True
            
            if not has_label:
                inputs_without_labels.append(input_elem)
        
        if inputs_without_labels:
            issue = self.create_issue(
                "missing_form_labels",
                Severity.WARNING,
                f"发现 {len(inputs_without_labels)} 个表单元素缺少标签",
                fix_suggestion="为所有表单元素添加适当的label或aria-label"
            )
            result.add_issue(issue)
            score -= min(len(inputs_without_labels) * 3, 15)
        
        return score
    
    def _check_performance_hints(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check performance-related HTML elements."""
        
        # Check for viewport meta tag
        viewport_meta = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport_meta:
            issue = self.create_issue(
                "missing_viewport_meta",
                Severity.WARNING,
                "页面缺少viewport meta标签",
                fix_suggestion="添加viewport meta标签以支持响应式设计"
            )
            result.add_issue(issue)
            score -= 10
        
        # Check for charset declaration
        charset_meta = soup.find('meta', attrs={'charset': True}) or \
                     soup.find('meta', attrs={'http-equiv': 'Content-Type'})
        if not charset_meta:
            issue = self.create_issue(
                "missing_charset",
                Severity.WARNING,
                "页面缺少字符编码声明",
                fix_suggestion="在<head>中添加<meta charset=\"UTF-8\">"
            )
            result.add_issue(issue)
            score -= 5
        
        # Check for external resources without proper attributes
        external_scripts = soup.find_all('script', src=True)
        external_links = soup.find_all('link', href=True)
        
        scripts_without_async_defer = [
            script for script in external_scripts 
            if not script.get('async') and not script.get('defer')
        ]
        
        if scripts_without_async_defer:
            issue = self.create_issue(
                "blocking_scripts",
                Severity.INFO,
                f"发现 {len(scripts_without_async_defer)} 个可能阻塞渲染的脚本",
                fix_suggestion="考虑为外部脚本添加async或defer属性"
            )
            result.add_issue(issue)
            score -= 3
        
        return score
    
    def _check_social_media_tags(self, soup: BeautifulSoup, result: AssessmentResult, score: float) -> float:
        """Check social media meta tags (Open Graph, Twitter Cards)."""
        
        # Check Open Graph tags
        og_tags = soup.find_all('meta', attrs={'property': lambda x: x and x.startswith('og:')})
        essential_og_tags = ['og:title', 'og:description', 'og:image', 'og:url']
        found_og_tags = [tag.get('property') for tag in og_tags]
        
        missing_og_tags = [tag for tag in essential_og_tags if tag not in found_og_tags]
        
        if missing_og_tags:
            issue = self.create_issue(
                "missing_og_tags",
                Severity.INFO,
                f"缺少Open Graph标签: {', '.join(missing_og_tags)}",
                fix_suggestion="添加Open Graph标签以改善社交媒体分享效果"
            )
            result.add_issue(issue)
            score -= 2
        
        # Check Twitter Card tags
        twitter_tags = soup.find_all('meta', attrs={'name': lambda x: x and x.startswith('twitter:')})
        if not twitter_tags:
            issue = self.create_issue(
                "missing_twitter_cards",
                Severity.INFO,
                "缺少Twitter Card标签",
                fix_suggestion="添加Twitter Card标签以改善Twitter分享效果"
            )
            result.add_issue(issue)
            score -= 2
        
        return score
    
    def _collect_metrics(self, soup: BeautifulSoup, target_url: str) -> Dict[str, Any]:
        """Collect various metrics from the HTML analysis."""
        
        # Basic counts
        images = soup.find_all('img')
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        links = soup.find_all('a', href=True)
        forms = soup.find_all('form')
        
        # External vs internal links
        domain = urlparse(target_url).netloc
        external_links = []
        internal_links = []
        
        for link in links:
            href = link.get('href', '')
            if href.startswith('http'):
                link_domain = urlparse(href).netloc
                if link_domain != domain:
                    external_links.append(link)
                else:
                    internal_links.append(link)
            else:
                internal_links.append(link)
        
        # Text content analysis
        text_content = soup.get_text()
        word_count = len(text_content.split()) if text_content else 0
        
        # Semantic elements
        semantic_elements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']
        found_semantic = [elem for elem in semantic_elements if soup.find(elem)]
        
        return {
            # Basic HTML structure
            "has_doctype": str(soup).strip().lower().startswith('<!doctype html>'),
            "has_title": bool(soup.find('title')),
            "title_length": len(soup.find('title').get_text()) if soup.find('title') else 0,
            "has_meta_description": bool(soup.find('meta', attrs={'name': 'description'})),
            "has_lang_attribute": bool(soup.find('html', lang=True)),
            "has_charset": bool(soup.find('meta', attrs={'charset': True})),
            "has_viewport": bool(soup.find('meta', attrs={'name': 'viewport'})),
            
            # Content counts
            "total_images": len(images),
            "images_without_alt": len([img for img in images if not img.get('alt')]),
            "total_headings": len(headings),
            "h1_count": len(soup.find_all('h1')),
            "total_links": len(links),
            "external_links": len(external_links),
            "internal_links": len(internal_links),
            "total_forms": len(forms),
            "word_count": word_count,
            
            # Semantic HTML
            "semantic_elements_used": len(found_semantic),
            "semantic_elements_list": found_semantic,
            
            # SEO elements
            "has_canonical": bool(soup.find('link', attrs={'rel': 'canonical'})),
            "has_robots_meta": bool(soup.find('meta', attrs={'name': 'robots'})),
            
            # Social media
            "og_tags_count": len(soup.find_all('meta', attrs={'property': lambda x: x and x.startswith('og:')})),
            "twitter_tags_count": len(soup.find_all('meta', attrs={'name': lambda x: x and x.startswith('twitter:')})),
            
            # Performance hints
            "external_scripts": len(soup.find_all('script', src=True)),
            "external_stylesheets": len(soup.find_all('link', rel='stylesheet')),
        }
    
    def get_module_info(self) -> Dict[str, Any]:
        """Return module information."""
        return {
            "name": self.name,
            "description": "增强的HTML结构和SEO分析",
            "version": "2.0.0",
            "checks": [
                "HTML5文档结构",
                "SEO基础元素",
                "语义化HTML标签",
                "可访问性基础",
                "性能优化提示",
                "社交媒体标签",
                "表单标签验证",
                "链接分析"
            ]
        }