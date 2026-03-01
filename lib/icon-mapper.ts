import {
    // Process & Workflow
    MessageSquare, Lightbulb, Palette, Code, Rocket, HeartHandshake,
    // Goals & Performance
    Target, Users, TrendingUp, Zap, Shield, Award,
    // Communication & Social
    Mail, Phone, Send, Share2, MessageCircle, Bell,
    Youtube, Github, Linkedin, Twitter, Facebook, Instagram, Dribbble, Globe, Link, ExternalLink,
    // Business & Finance
    Briefcase, DollarSign, TrendingDown, PieChart, BarChart3, LineChart,
    // Design & Creative
    Pen, Brush, Layers, Layout, Figma, Image,
    // Development & Tech
    Terminal, Database, Server, Cloud, Cpu, HardDrive,
    // UI & Navigation
    Home, Settings, Search, Filter, Menu, Grid,
    // Actions & Controls
    Play, Pause, Download, Upload, RefreshCw, Save,
    // Status & Indicators
    CheckCircle2, XCircle, AlertCircle, Info, HelpCircle, Clock,
    // Arrows & Directions
    ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
    // Files & Documents
    File, FileText, Folder, FolderOpen, Paperclip, BookOpen,
    // Shopping & Commerce
    ShoppingCart, ShoppingBag, CreditCard, Tag, Package, Gift,
    // Media & Entertainment
    Video, Music, Headphones, Camera, Film, Mic,
    type LucideIcon,
    Pin,
    LocationEdit,
    MapPin
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    // Process & Workflow
    MessageSquare, Lightbulb, Palette, Code, Rocket, HeartHandshake,
    // Goals & Performance
    Target, Users, TrendingUp, Zap, Shield, Award,
    // Communication & Social
    Mail, Phone, Send, Share2, MessageCircle, Bell,
    Youtube, Github, Linkedin, Twitter, Facebook, Instagram, Dribbble, Globe, Link, ExternalLink,
    // Business & Finance
    Briefcase, DollarSign, TrendingDown, PieChart, BarChart3, LineChart,
    // Design & Creative
    Pen, Brush, Layers, Layout, Figma, Image,
    // Development & Tech
    Terminal, Database, Server, Cloud, Cpu, HardDrive,
    // UI & Navigation
    Home, Settings, Search, Filter, Menu, Grid,
    // Actions & Controls
    Play, Pause, Download, Upload, RefreshCw, Save,
    // Status & Indicators
    CheckCircle2, XCircle, AlertCircle, Info, HelpCircle, Clock,
    // Arrows & Directions
    ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
    // Files & Documents
    File, FileText, Folder, FolderOpen, Paperclip, BookOpen,
    // Shopping & Commerce
    ShoppingCart, ShoppingBag, CreditCard, Tag, Package, Gift,
    // Media & Entertainment
    Video, Music, Headphones, Camera, Film, Mic,

    MapPin
};

/**
 * Maps an icon name string to a Lucide React icon component
 * @param iconName - The name of the icon (e.g., "MessageSquare", "Target")
 * @returns The corresponding Lucide icon component, or CheckCircle2 as fallback
 */
export function getIconByName(iconName: string): LucideIcon {
    return iconMap[iconName] || CheckCircle2;
}

/**
 * Get all available icon names
 */
export function getAllIconNames(): string[] {
    return Object.keys(iconMap);
}
