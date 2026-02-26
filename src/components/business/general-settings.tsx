"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Save, X } from "lucide-react"
import { useBusinesses } from "@/src/hooks/use-businesses"
import type { Business } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface GeneralSettingsProps {
  restaurant: Business
}

const AVAILABLE_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Wolof",
]

export function GeneralSettings({ restaurant }: GeneralSettingsProps) {
  const [name, setName] = useState(restaurant.name)
  const [description, setDescription] = useState(restaurant.description)
  const [cuisine, setCuisine] = useState(restaurant.cuisine || "")
  const [whatsappNumber, setWhatsappNumber] = useState(restaurant.whatsappNumber || "")
  const [businessHours, setBusinessHours] = useState(restaurant.chatbotContext?.businessHours || "")
  const [specialInstructions, setSpecialInstructions] = useState(restaurant.chatbotContext?.specialInstructions || "")
  const [supportedLanguages, setSupportedLanguages] = useState(restaurant.supportedLanguages || ["English"])
  const [isActive, setIsActive] = useState(restaurant.isActive || false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateRestaurant } = useBusinesses()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      updateRestaurant(restaurant.id, {
        name: name.trim(),
        description: description.trim(),
        cuisine: cuisine.trim(),
        whatsappNumber: whatsappNumber.trim(),
        supportedLanguages,
        isActive,
        chatbotContext: {
          ...restaurant.chatbotContext,
          businessHours: businessHours.trim(),
          specialInstructions: specialInstructions.trim(),
        },
      })

      toast({
        title: "Settings updated",
        description: "Your restaurant settings have been saved successfully.",
      })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  const addLanguage = (language: string) => {
    if (!supportedLanguages.includes(language)) {
      setSupportedLanguages([...supportedLanguages, language])
    }
  }

  const removeLanguage = (language: string) => {
    if (language !== "English") {
      // Always keep English
      setSupportedLanguages(supportedLanguages.filter((lang) => lang !== language))
    }
  }

  const hasChanges =
    name !== restaurant.name ||
    description !== restaurant.description ||
    cuisine !== (restaurant.cuisine || "") ||
    whatsappNumber !== (restaurant.whatsappNumber || "") ||
    businessHours !== (restaurant.chatbotContext?.businessHours || "") ||
    specialInstructions !== (restaurant.chatbotContext?.specialInstructions || "") ||
    JSON.stringify(supportedLanguages) !== JSON.stringify(restaurant.supportedLanguages || ["English"]) ||
    isActive !== (restaurant.isActive || false)

  return (
    <Card className="glass border-none shadow-2xl rounded-3xl overflow-hidden bg-white/40 dark:bg-black/20">
      <CardHeader className="bg-white/30 dark:bg-black/10 px-8 py-8 border-b border-border/10">
        <CardTitle className="text-3xl font-black text-gradient">General Settings</CardTitle>
        <CardDescription className="text-base font-medium">Update your restaurant's basic information and configuration</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Restaurant Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
                required
                className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="cuisine" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Cuisine Type</Label>
              <Input
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g., Italian, Mexican, Asian"
                className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your restaurant"
              rows={4}
              required
              className="bg-white/50 dark:bg-black/20 border-border/10 rounded-2xl focus:ring-primary/20 font-medium resize-none"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="whatsapp" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1234567890"
                type="tel"
                className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="hours" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Business Hours</Label>
              <Input
                id="hours"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="e.g., 10:00 AM - 10:00 PM"
                className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="special-instructions" className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Specialties & Policy Instructions</Label>
            <Textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="E.g., We are famous for our spicy wings. No deliveries after 9 PM. Be polite."
              rows={4}
              className="bg-white/50 dark:bg-black/20 border-border/10 rounded-2xl focus:ring-primary/20 font-medium resize-none"
            />
            <p className="text-xs text-muted-foreground font-medium ml-1">These instructions help the AI understand your specific rules and specialties.</p>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Supported Languages</Label>
            <Select onValueChange={addLanguage}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20 border-border/10 h-12 rounded-xl">
                <SelectValue placeholder="Add a language" />
              </SelectTrigger>
              <SelectContent className="glass">
                {AVAILABLE_LANGUAGES.filter((lang) => !supportedLanguages.includes(lang)).map((language) => (
                  <SelectItem key={language} value={language} className="font-medium">
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-4">
              {supportedLanguages.map((language) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none font-bold text-xs uppercase tracking-wider">
                  {language}
                  {language !== "English" && (
                    <X className="w-3.5 h-3.5 cursor-pointer hover:scale-120 transition-transform" onClick={() => removeLanguage(language)} />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-white/50 dark:bg-black/20 border border-border/10 shadow-sm">
            <div className="space-y-1">
              <Label htmlFor="active" className="text-base font-black tracking-tight">Chatbot Status</Label>
              <p className="text-sm text-muted-foreground font-medium">Enable or disable your WhatsApp chatbot</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-primary" />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!hasChanges || isLoading}
              className="min-w-[160px] rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-black py-6 h-auto text-lg gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
