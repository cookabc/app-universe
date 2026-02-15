"""
Source code HTML analysis module.
"""

import re
from pathlib import Path
from typing import Dict, Any, List, Set
from bs4 import BeautifulSoup

from ..core.source_analysis import SourceCodeAssessmentModule, ProjectStructure, SourceFile
from ..core.base import AssessmentResult, Priority, Effort, Impact, Severity


class SourceHTMLModule(SourceCodeAssessmentModule):
    """Analyze HTML files in source code for structure, SEO, and best practices."""
    
    async def assess_source_code(self, directory_path: Path) -> AssessmentResult:
        """Analyze HTML files in the source code directory."""
        result = AssessmentResult(self.name, 0.0)
        
        try:
            # Validate directory first
            if not directory_path.exists():
                raise ValueError(f"Directory does not exist: {directory_path}")
            if not directory_path.is_dir():
                raise ValueError(f"Path is not a directory: {directory_path}")
            
            # Scan the project
            project = self.scanner.scan_directory(directory_path)
            
            # Get HTML files
            html_files = project.get_files_by_extension('.html')
            html_files.extend(project.get_files_by_extension('.htm'))
            
            if not html_files:
                issue = self.create_issue(
                    "no_html_files",
                    Severity.INFO,
                    "项目中未找到HTML文件",
                    fix_suggestion="确保项目包含HTML文件或检查文件扩展名"
                )
                result.add_issue(issue)
                result.score = 0.0
                result.metrics = {
                    **self._analyze_project_structure(project),
                    "html_files_count": 0,
                    "html_files_total_size": 0,
                    "average_file_size": 0,
                    "files_with_issues": 0,
                    "average_score": 0,
                }
                return result
            
            # Analyze each HTML file
            total_score = 0.0
            file_analyses = []
            
            for html_file in html_files:
                file_analysis = self._analyze_html_file(html_file, result)
                file_analyses.append(file_analysis)
                total_score += file_analysis['score']
            
            # Calculate overall score
            result.score = total_score / len(html_files) if html_files else 0.0
            
            # Collect comprehensive metrics
            result.metrics = self._collect_comprehensive_metrics(
                project, html_files, file_analyses
            )
            
            # Generate project-level recommendations
            self._generate_project_recommendations(html_files, file_analyses, result)
            
        except ValueError:
            # Re-raise ValueError for invalid directories
            raise
        except Exception as e:
            issue = self.create_issue(
                "source_analysis_error",
                Severity.ERROR,
                f"源码分析过程中出错: {str(e)}",
                fix_suggestion="检查目录路径是否正确，确保有读取权限"
            )
            result.add_issue(issue)
            result.score = 0.0
        
        return result
    
    def _analyze_html_file(self, html_file: SourceFile, result: AssessmentResult) -> Dict[str, Any]:
        """Analyze a single HTML file."""
        file_analysis = {
            'path': str(html_file.relative_path),
            'score': 100.0,
            'issues': [],
            'metrics': {}
        }
        
        try:
            soup = BeautifulSoup(html_file.content, 'html.parser')
            score = 100.0
            initial_issue_count = len(result.issues)
            
            # Check basic HTML structure
            score = self._check_html_structure(soup, html_file, result, score)
            
            # Check SEO elements
            score = self._check_seo_elements(soup, html_file, result, score)
            
            # Check accessibility
            score = self._check_accessibility(soup, html_file, result, score)
            
            # Check performance hints
            score = self._check_performance_hints(soup, html_file, result, score)
            
            # Check code quality
            score = self._check_code_quality(html_file, result, score)
            
            file_analysis['score'] = max(0.0, score)
            file_analysis['metrics'] = self._collect_file_metrics(soup, html_file)
            
            # Track if this file has issues
            file_analysis['has_issues'] = len(result.issues) > initial_issue_count
            
        except Exception as e:
            issue = self.create_issue(
                "file_parse_error",
                Severity.ERROR,
                f"解析HTML文件失败 {html_file.relative_path}: {str(e)}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="检查HTML文件语法是否正确"
            )
            result.add_issue(issue)
            file_analysis['score'] = 0.0
            file_analysis['has_issues'] = True
        
        return file_analysis
    
    def _check_html_structure(self, soup: BeautifulSoup, html_file: SourceFile, 
                            result: AssessmentResult, score: float) -> float:
        """Check HTML document structure."""
        
        # Check DOCTYPE
        doctype_pattern = re.compile(r'<!DOCTYPE\s+html>', re.IGNORECASE)
        if not doctype_pattern.search(html_file.content):
            issue = self.create_issue(
                "missing_doctype",
                Severity.WARNING,
                f"文件缺少HTML5 DOCTYPE: {html_file.relative_path}",
                location={"file": str(html_file.relative_path), "line": 1},
                fix_suggestion="在文件开头添加 <!DOCTYPE html>"
            )
            result.add_issue(issue)
            score -= 10
        
        # Check html tag with lang
        html_tag = soup.find('html')
        if not html_tag or not html_tag.get('lang'):
            issue = self.create_issue(
                "missing_lang_attribute",
                Severity.WARNING,
                f"HTML标签缺少lang属性: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="在<html>标签中添加lang属性"
            )
            result.add_issue(issue)
            score -= 5
        
        # Check head section
        head_tag = soup.find('head')
        if not head_tag:
            issue = self.create_issue(
                "missing_head_section",
                Severity.ERROR,
                f"文件缺少<head>部分: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="添加<head>部分包含页面元数据"
            )
            result.add_issue(issue)
            score -= 20
        
        # Check title
        title_tag = soup.find('title')
        if not title_tag:
            issue = self.create_issue(
                "missing_title",
                Severity.ERROR,
                f"文件缺少<title>标签: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="在<head>中添加<title>标签"
            )
            result.add_issue(issue)
            score -= 15
        elif len(title_tag.get_text().strip()) < 10:
            issue = self.create_issue(
                "title_too_short",
                Severity.WARNING,
                f"页面标题过短: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="扩展标题内容，建议10-60字符"
            )
            result.add_issue(issue)
            score -= 5
        
        return score
    
    def _check_seo_elements(self, soup: BeautifulSoup, html_file: SourceFile,
                          result: AssessmentResult, score: float) -> float:
        """Check SEO-related elements."""
        
        # Check meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc:
            issue = self.create_issue(
                "missing_meta_description",
                Severity.WARNING,
                f"文件缺少meta description: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="添加meta description标签"
            )
            result.add_issue(issue)
            score -= 10
        
        # Check charset
        charset_meta = soup.find('meta', attrs={'charset': True})
        if not charset_meta:
            issue = self.create_issue(
                "missing_charset",
                Severity.WARNING,
                f"文件缺少字符编码声明: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="在<head>中添加<meta charset=\"UTF-8\">"
            )
            result.add_issue(issue)
            score -= 5
        
        # Check viewport
        viewport_meta = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport_meta:
            issue = self.create_issue(
                "missing_viewport",
                Severity.WARNING,
                f"文件缺少viewport设置: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="添加viewport meta标签支持响应式设计"
            )
            result.add_issue(issue)
            score -= 8
        
        # Check heading structure
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        h1_count = len(soup.find_all('h1'))
        
        if h1_count == 0:
            issue = self.create_issue(
                "missing_h1",
                Severity.ERROR,
                f"文件缺少H1标题: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="添加一个主要的H1标题"
            )
            result.add_issue(issue)
            score -= 15
        elif h1_count > 1:
            issue = self.create_issue(
                "multiple_h1",
                Severity.WARNING,
                f"文件有多个H1标题: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="确保页面只有一个主要的H1标题"
            )
            result.add_issue(issue)
            score -= 5
        
        return score
    
    def _check_accessibility(self, soup: BeautifulSoup, html_file: SourceFile,
                           result: AssessmentResult, score: float) -> float:
        """Check accessibility elements."""
        
        # Check image alt attributes
        images = soup.find_all('img')
        images_without_alt = [img for img in images if not img.get('alt')]
        
        if images_without_alt:
            issue = self.create_issue(
                "missing_alt_attributes",
                Severity.WARNING,
                f"文件中{len(images_without_alt)}个图片缺少alt属性: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="为所有图片添加描述性的alt属性"
            )
            result.add_issue(issue)
            score -= min(len(images_without_alt) * 2, 15)
        
        # Check form labels
        inputs = soup.find_all(['input', 'textarea', 'select'])
        unlabeled_inputs = []
        
        for input_elem in inputs:
            input_type = input_elem.get('type', 'text')
            if input_type in ['hidden', 'submit', 'button']:
                continue
            
            # Check for associated label
            input_id = input_elem.get('id')
            has_label = False
            
            if input_id:
                label = soup.find('label', attrs={'for': input_id})
                if label:
                    has_label = True
            
            if not has_label and not input_elem.get('aria-label'):
                unlabeled_inputs.append(input_elem)
        
        if unlabeled_inputs:
            issue = self.create_issue(
                "missing_form_labels",
                Severity.WARNING,
                f"文件中{len(unlabeled_inputs)}个表单元素缺少标签: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="为表单元素添加label或aria-label"
            )
            result.add_issue(issue)
            score -= min(len(unlabeled_inputs) * 3, 10)
        
        return score
    
    def _check_performance_hints(self, soup: BeautifulSoup, html_file: SourceFile,
                               result: AssessmentResult, score: float) -> float:
        """Check performance-related elements."""
        
        # Check for blocking scripts
        scripts = soup.find_all('script', src=True)
        blocking_scripts = [s for s in scripts if not s.get('async') and not s.get('defer')]
        
        if blocking_scripts:
            issue = self.create_issue(
                "blocking_scripts",
                Severity.INFO,
                f"文件中{len(blocking_scripts)}个脚本可能阻塞渲染: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="考虑为脚本添加async或defer属性"
            )
            result.add_issue(issue)
            score -= 3
        
        # Check for inline styles (should be minimal)
        inline_styles = soup.find_all(attrs={'style': True})
        if len(inline_styles) > 5:
            issue = self.create_issue(
                "excessive_inline_styles",
                Severity.INFO,
                f"文件中内联样式过多({len(inline_styles)}个): {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="考虑将样式移到外部CSS文件"
            )
            result.add_issue(issue)
            score -= 2
        
        return score
    
    def _check_code_quality(self, html_file: SourceFile, result: AssessmentResult, 
                          score: float) -> float:
        """Check HTML code quality."""
        
        content = html_file.content
        
        # Check for TODO/FIXME comments
        todo_pattern = re.compile(r'<!--.*?(TODO|FIXME|HACK|XXX).*?-->', re.IGNORECASE | re.DOTALL)
        todos = todo_pattern.findall(content)
        
        if todos:
            issue = self.create_issue(
                "todo_comments",
                Severity.INFO,
                f"文件中发现{len(todos)}个待办注释: {html_file.relative_path}",
                location={"file": str(html_file.relative_path)},
                fix_suggestion="处理待办事项或移除注释"
            )
            result.add_issue(issue)
            score -= 1
        
        # Check for very long lines (> 120 characters)
        lines = content.split('\n')
        long_lines = [i+1 for i, line in enumerate(lines) if len(line) > 120]
        
        if long_lines:
            issue = self.create_issue(
                "long_lines",
                Severity.INFO,
                f"文件中{len(long_lines)}行代码过长: {html_file.relative_path}",
                location={"file": str(html_file.relative_path), "lines": long_lines[:5]},
                fix_suggestion="考虑将长行拆分以提高可读性"
            )
            result.add_issue(issue)
            score -= min(len(long_lines) * 0.5, 2)  # Reduce score but cap the penalty
        
        return score
    
    def _collect_file_metrics(self, soup: BeautifulSoup, html_file: SourceFile) -> Dict[str, Any]:
        """Collect metrics for a single HTML file."""
        
        # Count elements
        images = soup.find_all('img')
        links = soup.find_all('a', href=True)
        forms = soup.find_all('form')
        scripts = soup.find_all('script')
        stylesheets = soup.find_all('link', rel='stylesheet')
        
        # Count semantic elements
        semantic_elements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']
        found_semantic = [elem for elem in semantic_elements if soup.find(elem)]
        
        return {
            "file_size_bytes": html_file.size,
            "file_size_kb": round(html_file.size / 1024, 1),
            "total_images": len(images),
            "images_without_alt": len([img for img in images if not img.get('alt')]),
            "total_links": len(links),
            "total_forms": len(forms),
            "total_scripts": len(scripts),
            "external_scripts": len([s for s in scripts if s.get('src')]),
            "total_stylesheets": len(stylesheets),
            "semantic_elements_count": len(found_semantic),
            "semantic_elements": found_semantic,
            "has_title": bool(soup.find('title')),
            "has_meta_description": bool(soup.find('meta', attrs={'name': 'description'})),
            "has_viewport": bool(soup.find('meta', attrs={'name': 'viewport'})),
            "h1_count": len(soup.find_all('h1')),
            "total_headings": len(soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']))
        }
    
    def _collect_comprehensive_metrics(self, project: ProjectStructure, 
                                     html_files: List[SourceFile],
                                     file_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Collect comprehensive metrics for the entire project."""
        
        base_metrics = self._analyze_project_structure(project)
        
        # HTML-specific metrics
        html_metrics = {
            "html_files_count": len(html_files),
            "html_files_total_size": sum(f.size for f in html_files),
            "average_file_size": sum(f.size for f in html_files) / len(html_files) if html_files else 0,
            "files_with_issues": len([a for a in file_analyses if a.get('has_issues', False)]),
            "average_score": sum(a['score'] for a in file_analyses) / len(file_analyses) if file_analyses else 0,
        }
        
        # Aggregate file metrics
        total_images = sum(a['metrics'].get('total_images', 0) for a in file_analyses)
        total_images_without_alt = sum(a['metrics'].get('images_without_alt', 0) for a in file_analyses)
        
        aggregate_metrics = {
            "total_images_all_files": total_images,
            "total_images_without_alt": total_images_without_alt,
            "alt_attribute_coverage": round((total_images - total_images_without_alt) / total_images * 100, 1) if total_images > 0 else 100,
            "files_with_h1": len([a for a in file_analyses if a['metrics'].get('h1_count', 0) > 0]),
            "files_with_meta_description": len([a for a in file_analyses if a['metrics'].get('has_meta_description', False)]),
            "files_with_viewport": len([a for a in file_analyses if a['metrics'].get('has_viewport', False)]),
        }
        
        return {**base_metrics, **html_metrics, **aggregate_metrics}
    
    def _generate_project_recommendations(self, html_files: List[SourceFile],
                                        file_analyses: List[Dict[str, Any]],
                                        result: AssessmentResult) -> None:
        """Generate project-level recommendations."""
        
        # Check if many files are missing alt attributes
        files_with_alt_issues = len([a for a in file_analyses 
                                   if a['metrics'].get('images_without_alt', 0) > 0])
        
        if files_with_alt_issues > len(html_files) * 0.5:  # More than 50% of files
            rec = self.create_recommendation(
                "批量添加图片Alt属性",
                f"项目中{files_with_alt_issues}个HTML文件存在图片alt属性问题，建议批量处理",
                "accessibility",
                Priority.HIGH,
                Effort.MEDIUM,
                Impact.HIGH,
                files_with_alt_issues * 0.5
            )
            result.add_recommendation(rec)
        
        # Check if many files are missing meta descriptions
        files_without_meta = len([a for a in file_analyses 
                                if not a['metrics'].get('has_meta_description', False)])
        
        if files_without_meta > 0:
            rec = self.create_recommendation(
                "添加Meta描述",
                f"项目中{files_without_meta}个HTML文件缺少meta描述，影响SEO效果",
                "seo",
                Priority.MEDIUM,
                Effort.LOW,
                Impact.MEDIUM,
                files_without_meta * 0.25
            )
            result.add_recommendation(rec)
        
        # Check viewport settings
        files_without_viewport = len([a for a in file_analyses 
                                    if not a['metrics'].get('has_viewport', False)])
        
        if files_without_viewport > 0:
            rec = self.create_recommendation(
                "添加响应式设计支持",
                f"项目中{files_without_viewport}个HTML文件缺少viewport设置，影响移动端体验",
                "responsive",
                Priority.MEDIUM,
                Effort.LOW,
                Impact.HIGH,
                files_without_viewport * 0.1
            )
            result.add_recommendation(rec)
    
    def get_module_info(self) -> Dict[str, Any]:
        """Return module information."""
        return {
            "name": self.name,
            "description": "源码HTML结构和质量分析",
            "version": "1.0.0",
            "analysis_type": "source_code",
            "supported_files": [".html", ".htm"],
            "checks": [
                "HTML5文档结构",
                "SEO基础元素",
                "可访问性检查",
                "性能优化提示",
                "代码质量检查",
                "项目级别统计",
                "批量问题检测"
            ]
        }