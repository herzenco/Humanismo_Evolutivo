"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { contentKeys } from '@/lib/content';
import { refreshPublicContent } from '@/lib/refresh-content';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

export const ContentEditor = () => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  const { data: contents, isLoading } = useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      const key = editingContent?.key || formData.key;
      if (!contentKeys.includes(key)) throw new Error('Selecciona una clave de texto del sitio.');
      if (!['es', 'en'].includes(formData.language)) throw new Error('El idioma debe ser es o en.');
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error('No user found');

      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('site_content')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            language: formData.language,
            updated_by: data.user.id,
          })
          .eq('id', editingContent.id);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('site_content')
          .insert({
            key: formData.key,
            title: formData.title,
            content: formData.content,
            category: formData.category,
            language: formData.language,
            updated_by: data.user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: async () => {
      const refreshed = await refreshPublicContent();
      if (!refreshed) toast({ title: 'Contenido guardado', description: 'La publicación puede tardar hasta un minuto.' });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      setIsDialogOpen(false);
      setEditingContent(null);
      toast({
        title: 'Éxito',
        description: editingContent ? 'Contenido actualizado correctamente' : 'Contenido agregado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      const refreshed = await refreshPublicContent();
      if (!refreshed) toast({ title: 'Contenido guardado', description: 'La publicación puede tardar hasta un minuto.' });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast({
        title: 'Éxito',
        description: 'Contenido eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveMutation.mutate({
      key: formData.get('key'),
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      language: formData.get('language'),
    });
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editor de Contenido</h2>
          <p className="text-muted-foreground">
            Administra los textos del sitio web
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContent(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingContent ? 'Editar Contenido' : 'Nuevo Contenido'}</DialogTitle>
              <DialogDescription>
                Selecciona la clave del texto que deseas cambiar. El contenido se publica en el idioma elegido.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="key">Clave única</Label>
                <select id="key" name="key" className="w-full rounded-md border p-2" defaultValue={editingContent?.key || ''} required disabled={!!editingContent}>
                  <option value="" disabled>Selecciona el texto del sitio</option>
                  {contentKeys.map(key => <option key={key} value={key}>{key}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingContent?.title}
                  required
                  placeholder="Título del Hero"
                />
              </div>
              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingContent?.content}
                  required
                  rows={8}
                  placeholder="Contenido del texto..."
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingContent?.category}
                  required
                  placeholder="hero, about, books"
                />
              </div>
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  name="language"
                  defaultValue={editingContent?.language || 'es'}
                  required
                  placeholder="es, en"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingContent(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contents?.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {content.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {content.key}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-xs">{content.category}</span>
                    <span className="mx-2">•</span>
                    <span className="text-xs uppercase">{content.language}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingContent(content);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {content.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
