'use client';

import { useRouter, usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Globe } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ur', label: 'اردو' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' },
];

export default function LanguageSwitcher({ currentLang ,className}: { currentLang: string ,className?:string}) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLang: string) => {
        // Split path and replace first segment with newLang
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) segments[0] = newLang; // first segment = lang
        const newPath = '/' + segments.join('/');
        router.push(newPath);
    };

    const currentLabel = LANGUAGES.find(lang => lang.code === currentLang)?.label || 'Language';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={className}>
                    {currentLabel} <Globe />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='border-border'>
                {LANGUAGES.map(lang => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                    >
                        {lang.label}
                        {currentLang === lang.code && (
                            <Check className="h-4 w-4 " />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
