/**
 * [INPUT]: 依赖 lucide-react 图标、shadcn/ui Button/Input 组件
 * [OUTPUT]: 对外提供 Footer 页脚组件
 * [POS]: layout/ 的全局页脚，包含导航链接和订阅表单
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { School, Twitter, Github } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-border pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-6 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <School className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold">AGISchool</h2>
            </div>
            <p className="text-sm text-text-muted dark:text-gray-400">
              Empowering the next generation of innovators with AI literacy.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Platform</h3>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">Courses</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">Projects</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">For Schools</a>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Company</h3>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">About Us</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">Careers</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary transition-colors" href="#">Blog</a>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Stay Updated</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1 h-10"
              />
              <Button className="h-10 px-4">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="text-sm text-text-muted dark:text-gray-500">© 2024 AGISchool. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-text-muted dark:text-gray-500 hover:text-primary transition-colors" href="#">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </a>
            <a className="text-text-muted dark:text-gray-500 hover:text-primary transition-colors" href="#">
              <span className="sr-only">GitHub</span>
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
