"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { siteSettingsSchema, SiteSettingsValues } from "@/lib/validations/site-settings"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormInput } from "@/components/admin/form/FormInput"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/form/ImageUpload"
import { Spinner } from "@/components/ui/spinner"
import { CommaKeywordsInput } from "@/components/admin/form/CommaKeywordsInput"
import { SchemaListInput } from "@/components/admin/form/SchemaListInput"
import { updateSiteSettings } from "@/app/actions/siteSettings"
import { errorToast, successToast } from "@/lib/toastNotifications"
import { Save, Globe, Info, Mail, Share2, Scale, AlertCircle, Menu as MenuIcon, ExternalLink, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { IconSelect } from "@/components/admin/form/IconSelect"

interface SiteSettingsFormProps {
    initialData?: SiteSettingsValues
    menus: any[]
}

export function SiteSettingsForm({ initialData, menus: initialMenus }: SiteSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SiteSettingsValues>({
        resolver: zodResolver(siteSettingsSchema) as any,
        defaultValues: initialData || {
            siteName: "",
            tagline: "",
            logo: undefined as any,
            favicon: undefined as any,
            seo: {
                metaTitle: "",
                metaDescription: "",
                focusKeyword: "",
                relatedKeywords: [],
                schemas: [""]
            },
            footerMenu: { _type: 'reference', _ref: "" },
            footerText: "",
            copyright: "",
            contactInfo: [],
            socialLinks: [],
            footerCTA: {
                eyebrow: "",
                headingPrefix: "",
                headingHighlight: "",
                buttonText: "",
                buttonUrl: "/contact"
            }
        } as unknown as SiteSettingsValues,
    })

    const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
        control: form.control,
        name: "contactInfo"
    })

    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
        control: form.control,
        name: "socialLinks"
    })

    const [menus] = useState<any[]>(initialMenus || [])



    const formControl = form.control as any

    async function onSubmit(values: SiteSettingsValues) {
        setIsLoading(true)
        try {
            const result = await updateSiteSettings(values)
            if (result.success) {
                successToast("Site settings updated successfully")
            } else {
                errorToast(result.error || "Failed to update site settings")
            }
        } catch (error) {
            errorToast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const formErrors = form.formState.errors;
    const hasErrors = Object.keys(formErrors).length > 0

    const tabErrors = {
        branding: !!(formErrors.siteName || formErrors.tagline || formErrors.logo || formErrors.favicon),
        seo: !!formErrors.seo,
        contact: !!formErrors.contactInfo,
        social: !!formErrors.socialLinks,
        footer: !!(formErrors.footerText || formErrors.copyright || formErrors.footerCTA),
        menu: !!(formErrors.headerMenu || formErrors.footerMenu),
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-2 sm:py-4 border-b">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Site Settings</h1>
                        <p className="text-muted-foreground text-xs sm:text-sm">Manage global configurations for your website.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {hasErrors && (
                            <div className="flex items-center gap-2 text-destructive text-xs font-semibold px-3 py-1 bg-destructive/10 rounded-full border border-destructive/20 animate-in fade-in slide-in-from-right-2">
                                <AlertCircle className="h-3 w-3" />
                                <span className="hidden sm:inline">Missing required info</span>
                                <span className="sm:hidden">Missing info</span>
                            </div>
                        )}
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[120px] h-9 sm:h-10 text-sm sm:text-base">
                            {isLoading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="branding" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6 h-auto gap-2 bg-transparent p-0 mb-6">
                        <TabsTrigger
                            value="branding"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <Info className="h-4 w-4 mr-2 hidden sm:inline" /> Branding
                            {tabErrors.branding && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger
                            value="menu"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <MenuIcon className="h-4 w-4 mr-2 hidden sm:inline" /> Menu
                            {tabErrors.menu && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger
                            value="seo"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <Globe className="h-4 w-4 mr-2 hidden sm:inline" /> SEO
                            {tabErrors.seo && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger
                            value="contact"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <Mail className="h-4 w-4 mr-2 hidden sm:inline" /> Contact
                            {tabErrors.contact && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger
                            value="social"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <Share2 className="h-4 w-4 mr-2 hidden sm:inline" /> Social
                            {tabErrors.social && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                        <TabsTrigger
                            value="footer"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border h-10 px-4 relative"
                        >
                            <Scale className="h-4 w-4 mr-2 hidden sm:inline" /> Header/Footer Settings
                            {tabErrors.footer && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="branding" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Site Identity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="siteName" label="Site Name" />
                                <FormInput control={formControl} name="tagline" label="Tagline" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ImageUpload
                                        value={form.watch('logo') as any}
                                        label="Site Logo"
                                        onChange={(asset) => {
                                            if (!asset) {
                                                form.setValue('logo', null as any)
                                                return
                                            }
                                            form.setValue('logo', {
                                                _type: 'image',
                                                asset: {
                                                    _type: 'reference',
                                                    _ref: asset._id || asset.id,
                                                },
                                                url: asset.url
                                            })
                                        }}
                                    />

                                    <ImageUpload
                                        value={form.watch('favicon') as any}
                                        label="Favicon"
                                        onChange={(asset) => {
                                            if (!asset) {
                                                form.setValue('favicon', null as any)
                                                return
                                            }
                                            form.setValue('favicon', {
                                                _type: 'image',
                                                asset: {
                                                    _type: 'reference',
                                                    _ref: asset._id || asset.id,
                                                },
                                                url: asset.url
                                            })
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Default SEO Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormInput control={formControl} name="seo.metaTitle" label="Default Meta Title" />
                                <FormInput control={formControl} name="seo.metaDescription" label="Default Meta Description" isTextarea />
                                <FormInput control={formControl} name="seo.focusKeyword" label="Focus Keyword" />
                                <CommaKeywordsInput name="seo.relatedKeywords" label="Related Keywords" />
                                <SchemaListInput name="seo.schemas" label="Default Schema Markups (JSON-LD)" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-muted-foreground">Manage your contact details like email, phone, and office hours.</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendContact({ label: "", value: "", icon: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Contact Item
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {contactFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg relative items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 bg-background border rounded-full text-destructive shadow-sm"
                                                onClick={() => removeContact(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <FormInput
                                                control={formControl}
                                                name={`contactInfo.${index}.label`}
                                                label="Heading"
                                                placeholder="e.g. Support Email"
                                            />
                                            <FormInput
                                                control={formControl}
                                                name={`contactInfo.${index}.value`}
                                                label="Value"
                                                placeholder="e.g. info@example.com"
                                            />
                                            <FormField
                                                control={formControl}
                                                name={`contactInfo.${index}.icon`}
                                                render={({ field }) => (
                                                    <IconSelect field={field} type="social" label="Icon" />
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media Profiles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-muted-foreground">Manage your presence on social media platforms.</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendSocial({ label: "", icon: "", url: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Social Link
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {socialFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border rounded-lg relative items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 bg-background border rounded-full text-destructive shadow-sm"
                                                onClick={() => removeSocial(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <FormInput
                                                control={formControl}
                                                name={`socialLinks.${index}.label`}
                                                label="Platform Name"
                                                placeholder="e.g. YouTube"
                                            />
                                            <FormInput
                                                control={formControl}
                                                name={`socialLinks.${index}.url`}
                                                label="Profile URL"
                                                placeholder="https://..."
                                            />
                                            <FormField
                                                control={formControl}
                                                name={`socialLinks.${index}.icon`}
                                                render={({ field }) => (
                                                    <IconSelect field={field} type="social" label="Icon" />
                                                )}
                                            />

                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="footer" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Footer & Legal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormInput control={formControl} name="footerText" label="Footer About Text" isTextarea />
                                <FormInput control={formControl} name="copyright" label="Copyright Notice" />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Call to Action</CardTitle>
                                <CardDescription>Customize the big CTA section shown above the header and footer.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormInput
                                    control={formControl}
                                    name="footerCTA.eyebrow"
                                    label="Eyebrow Text"
                                    placeholder="e.g. Have a project in mind?"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        control={formControl}
                                        name="footerCTA.headingPrefix"
                                        label="Heading Prefix"
                                        placeholder="e.g. Let's work"
                                    />
                                    <FormInput
                                        control={formControl}
                                        name="footerCTA.headingHighlight"
                                        label="Heading Highlight (Stroked)"
                                        placeholder="e.g. together"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                    <FormInput
                                        control={formControl}
                                        name="footerCTA.buttonText"
                                        label="Button Text"
                                        placeholder="e.g. Start a Project"
                                    />
                                    <FormInput
                                        control={formControl}
                                        name="footerCTA.buttonUrl"
                                        label="Button URL"
                                        placeholder="/contact"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="menu" className="space-y-6">
                        <Card className="border-2 border-primary/20 shadow-md">
                            <CardHeader className="bg-primary/5 border-b py-4">
                                <CardTitle className="text-xl">Menu Management</CardTitle>
                                <CardDescription>Assign specific menu documents to the website navigation areas.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField
                                        control={formControl}
                                        name="headerMenu._ref"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-base font-bold">Header Menu</FormLabel>
                                                    <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                                                        <Link href="/admin/menus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            Manage Menus <ExternalLink className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="h-12 text-base">
                                                            <SelectValue placeholder="Select a menu for Header" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {menus.filter(menu => menu.location === 'header').map((menu) => (
                                                                <SelectItem key={menu._id} value={menu._id}>
                                                                    {menu.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    This menu will appear in the main navigation bar at the top of the site.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formControl}
                                        name="footerMenu._ref"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-base font-bold">Footer Menu</FormLabel>
                                                    <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                                                        <Link
                                                            href="/admin/menus"
                                                            target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            Manage Menus <ExternalLink className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="h-12 text-base">
                                                            <SelectValue placeholder="Select a menu for Footer" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {menus.filter(menu => menu.location === 'footer').map((menu) => (
                                                                <SelectItem key={menu._id} value={menu._id}>
                                                                    {menu.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    This menu will appear in the website footer.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
