'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const user = session.user
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name || 'User'} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || 'Utilisateur'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Informations du compte</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nom</p>
                <p>{user?.name || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{user?.email || 'Non défini'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
