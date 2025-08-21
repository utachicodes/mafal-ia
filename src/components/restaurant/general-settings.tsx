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
import { useRestaurants } from "@/src/hooks/use-restaurants"
import type { Restaurant } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface GeneralSettingsProps {
  restaurant: Restaurant
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
  const [supportedLanguages, setSupportedLanguages] = useState(restaurant.supportedLanguages || ["English"])
  const [isActive, setIsActive] = useState(restaurant.isActive || false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateRestaurant } = useRestaurants()
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
    JSON.stringify(supportedLanguages) !== JSON.stringify(restaurant.supportedLanguages || ["English"]) ||
    isActive !== (restaurant.isActive || false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Update your restaurant's basic information and configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g., Italian, Mexican, Asian"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your restaurant"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+1234567890"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label>Supported Languages</Label>
            <Select onValueChange={addLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Add a language" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_LANGUAGES.filter((lang) => !supportedLanguages.includes(lang)).map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {supportedLanguages.map((language) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  {language !== "English" && (
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeLanguage(language)} />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="active">Chatbot Status</Label>
              <p className="text-sm text-muted-foreground">Enable or disable your WhatsApp chatbot</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!hasChanges || isLoading}
              className="min-w-[120px] bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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
