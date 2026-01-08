/**
 * [INPUT]: 依赖 clsx 类名拼接库、tailwind-merge Tailwind 类名去重库
 * [OUTPUT]: 对外提供 cn() 类名智能合并函数
 * [POS]: lib/ 的工具函数模块，为全项目提供样式类名处理能力
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
