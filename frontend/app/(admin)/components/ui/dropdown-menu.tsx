"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const Select: React.FC<SelectProps> = ({ children, value, onValueChange, placeholder, className }) => {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
}

interface SelectItemProps {
  children: React.ReactNode
  value: string
}

const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
  return <option value={value}>{children}</option>
}

interface SelectContentProps {
  children: React.ReactNode
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return <>{children}</>
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface SelectValueProps {
  placeholder?: string
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <>{placeholder}</>
}

// Legacy DropdownMenu components for backward compatibility
interface DropdownMenuProps {
  children?: React.ReactNode
  className?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, className }) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, className }) => {
  return (
    <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}>
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ children, className }) => {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  )
}

interface DropdownMenuSeparatorProps {
  className?: string
}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className }) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  children,
  checked,
  onCheckedChange,
  className
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <div className="h-2 w-2 bg-current rounded-sm" />}
      </span>
      {children}
    </div>
  )
}

interface DropdownMenuRadioItemProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <div className="h-2 w-2 bg-current rounded-full" />
      </span>
      {children}
    </div>
  )
}

interface DropdownMenuShortcutProps {
  children: React.ReactNode
  className?: string
}

const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({ children, className }) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)}>
      {children}
    </span>
  )
}

// Legacy exports for compatibility
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuSubTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
