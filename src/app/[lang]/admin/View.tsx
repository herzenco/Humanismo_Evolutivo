"use client";

import { useEffect } from 'react';
import { useLocalizedRouter as useRouter } from '@/hooks/useLocalizedRouter';
import { useAdmin } from '@/hooks/useAdmin';
import PageWrapper from '@/components/layout/PageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ImageManager } from '@/components/admin/ImageManager';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { PodcastManager } from '@/components/admin/PodcastManager';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { isAdmin, loading, user } = useAdmin();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
      toast({
        title: 'Acceso Denegado',
        description: 'No tienes permisos de administrador',
        variant: 'destructive',
      });
    }
  }, [isAdmin, loading, router, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gold animate-pulse" />
            <p className="text-lg">Verificando permisos...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Shield className="h-8 w-8 text-gold" />
              Panel de Administración
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="podcasts">
            <PodcastManager />
          </TabsContent>

          <TabsContent value="images">
            <ImageManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
