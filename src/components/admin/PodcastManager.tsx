"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Music, Pencil, Trash2 } from 'lucide-react';
import { refreshPublicContent } from '@/lib/refresh-content';
import { books } from '@/data/books';

export const PodcastManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: podcastSeries, isLoading } = useQuery({
    queryKey: ['podcast-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('podcast_series')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('No user found');

      let imageUrl = formData.cover_image_url;

      // Upload file if provided
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${formData.book_id}-${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('admin-uploads')
          .upload(fileName, uploadFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-uploads')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      if (editingSeries) {
        // Update existing series
        const { error } = await supabase
          .from('podcast_series')
          .update({
            title_key: formData.title_key,
            description_key: formData.description_key,
            cover_image_url: imageUrl,
            updated_by: userData.user.id,
          })
          .eq('id', editingSeries.id);

        if (error) throw error;
      } else {
        // Create new series
        const { error } = await supabase
          .from('podcast_series')
          .insert({
            book_id: formData.book_id,
            title_key: formData.title_key,
            description_key: formData.description_key,
            cover_image_url: imageUrl,
            updated_by: userData.user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: async () => {
      await refreshPublicContent();
      queryClient.invalidateQueries({ queryKey: ['podcast-series'] });
      setIsDialogOpen(false);
      setEditingSeries(null);
      setUploadFile(null);
      toast({
        title: 'Éxito',
        description: editingSeries ? 'Serie de podcast actualizada' : 'Serie de podcast creada',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar la serie de podcast',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('podcast_series')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await refreshPublicContent();
      queryClient.invalidateQueries({ queryKey: ['podcast-series'] });
      toast({
        title: 'Éxito',
        description: 'Serie de podcast eliminada',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar la serie de podcast',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    uploadMutation.mutate({
      book_id: formData.get('book_id'),
      title_key: formData.get('title_key'),
      description_key: formData.get('description_key'),
      cover_image_url: editingSeries?.cover_image_url || '',
    });
  };

  const handleEdit = (series: any) => {
    setEditingSeries(series);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta serie de podcast?')) {
      deleteMutation.mutate(id);
    }
  };

  const getBookName = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book?.title || bookId;
  };

  if (isLoading) {
    return <div>Cargando series de podcasts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Podcasts</h2>
          <p className="text-muted-foreground">
            Administra las series de podcasts y sus imágenes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSeries(null);
              setUploadFile(null);
            }}>
              <Upload className="mr-2 h-4 w-4" />
              Nueva Serie de Podcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSeries ? 'Editar Serie de Podcast' : 'Nueva Serie de Podcast'}
              </DialogTitle>
              <DialogDescription>
                Asocia cada serie de podcast con un libro y su portada
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="book_id">Libro Asociado</Label>
                <Select 
                  name="book_id" 
                  defaultValue={editingSeries?.book_id}
                  disabled={!!editingSeries}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un libro" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editingSeries && (
                  <p className="text-xs text-muted-foreground mt-1">
                    El libro no puede cambiarse después de crear la serie
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title_key">Clave del Título (translation key)</Label>
                <Input
                  id="title_key"
                  name="title_key"
                  defaultValue={editingSeries?.title_key}
                  placeholder="podcast.series.ysn.title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description_key">Clave de Descripción (translation key)</Label>
                <Input
                  id="description_key"
                  name="description_key"
                  defaultValue={editingSeries?.description_key}
                  placeholder="podcast.series.ysn.description"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cover_image">Imagen de Portada</Label>
                <Input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                {editingSeries?.cover_image_url && (
                  <div className="mt-2">
                    <img
                      src={editingSeries.cover_image_url}
                      alt="Current cover"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {podcastSeries?.map((series) => (
          <Card key={series.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    {getBookName(series.book_id)}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {series.book_id}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(series)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(series.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {series.cover_image_url && (
                <img
                  src={series.cover_image_url}
                  alt={series.title_key}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
              )}
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <strong>Título:</strong> {series.title_key}
                </p>
                <p className="text-muted-foreground">
                  <strong>Descripción:</strong> {series.description_key}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!podcastSeries || podcastSeries.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No hay series de podcasts configuradas
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Crear Primera Serie
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
