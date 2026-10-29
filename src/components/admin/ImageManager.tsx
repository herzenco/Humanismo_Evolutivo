"use client";

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Pencil, Trash2 } from 'lucide-react';
import { refreshPublicContent } from '@/lib/refresh-content';
import { books } from '@/data/books';

interface ImageUsage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  usedIn: string[];
  isManaged: boolean;
  dbId?: string;
}

export const ImageManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>('none');

  const { data: dbImages, isLoading } = useQuery({
    queryKey: ['site-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Compilar solo las portadas de libros desde la base de datos
  const allImages = useMemo((): ImageUsage[] => {
    const images: ImageUsage[] = [];

    // Solo imágenes de la base de datos (portadas de libros)
    dbImages?.forEach((img) => {
      const usedIn: string[] = [];
      
      // Verificar si se usa en books
      const bookMatch = books.find(b => b.id === img.key);
      if (bookMatch) {
        usedIn.push(`Libro: ${bookMatch.title}`);
        usedIn.push(`Podcast: ${bookMatch.title}`);
      }

      images.push({
        id: img.key,
        url: img.url,
        title: img.title,
        description: img.description ?? undefined,
        category: img.category,
        usedIn,
        isManaged: true,
        dbId: img.id
      });
    });

    return images;
  }, [dbImages]);

  const uploadMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error('No user found');

      let imageUrl = formData.url;

      // Upload file if provided
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('admin-uploads')
          .upload(fileName, uploadFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admin-uploads')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const imageKey = (formData.bookId && formData.bookId !== 'none') ? formData.bookId : formData.key;
      const imageData = {
        key: imageKey,
        title: formData.title,
        description: formData.description,
        url: imageUrl,
        category: (formData.bookId && formData.bookId !== 'none') ? 'book-cover' : formData.category,
        updated_by: data.user.id,
      };

      // Use upsert to insert or update based on the unique key
      const { error } = await supabase
        .from('site_images')
        .upsert(imageData, {
          onConflict: 'key',
          ignoreDuplicates: false
        });

      if (error) throw error;
    },
    onSuccess: async () => {
      await refreshPublicContent();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
      queryClient.invalidateQueries({ queryKey: ['book-images'] });
      setIsDialogOpen(false);
      setEditingImage(null);
      setUploadFile(null);
      setSelectedBook('none');
      toast({
        title: 'Éxito',
        description: editingImage ? 'Portada actualizada correctamente' : 'Imagen agregada correctamente',
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
        .from('site_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await refreshPublicContent();
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
      queryClient.invalidateQueries({ queryKey: ['book-images'] });
      toast({
        title: 'Éxito',
        description: 'Imagen eliminada correctamente',
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
    uploadMutation.mutate({
      bookId: selectedBook,
      key: formData.get('key'),
      title: formData.get('title'),
      description: formData.get('description'),
      url: formData.get('url'),
      category: formData.get('category'),
    });
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestor de Imágenes</h2>
          <p className="text-muted-foreground">
            Todas las imágenes del sitio web y dónde se usan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingImage(null);
              setSelectedBook('none');
            }}>
              <Upload className="mr-2 h-4 w-4" />
              Subir Imagen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Editar Imagen' : 'Subir Nueva Imagen'}</DialogTitle>
              <DialogDescription>
                Asocia la imagen con un libro o súbela como imagen general
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="book">Asociar con Libro (opcional)</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un libro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno (imagen general)</SelectItem>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedBook === 'none' && (
                <div>
                  <Label htmlFor="key">Clave única</Label>
                  <Input
                    id="key"
                    name="key"
                    defaultValue={editingImage?.key}
                    required={!editingImage && !selectedBook}
                    disabled={!!editingImage}
                    placeholder="hero-background"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingImage?.title || (selectedBook !== 'none' ? books.find(b => b.id === selectedBook)?.title : '')}
                  required
                  placeholder="Imagen Hero Principal"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingImage?.description}
                  placeholder="Descripción de la imagen"
                />
              </div>
              {selectedBook === 'none' && (
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingImage?.category}
                    required={selectedBook === 'none'}
                    placeholder="hero, books, author"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="file">Archivo de Imagen</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              {!uploadFile && (
                <div>
                  <Label htmlFor="url">O URL de Imagen</Label>
                  <Input
                    id="url"
                    name="url"
                    defaultValue={editingImage?.url}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingImage(null);
                    setUploadFile(null);
                    setSelectedBook('none');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allImages?.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                <img
                  src={image.url}
                  alt={image.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{image.title}</CardTitle>
                <Badge variant={image.isManaged ? "default" : "secondary"}>
                  {image.isManaged ? "Editable" : "Sistema"}
                </Badge>
              </div>
              {image.description && (
                <CardDescription className="mb-2">
                  {image.description}
                </CardDescription>
              )}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Categoría:</span> {image.category}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Usado en:</span>
                  <div className="mt-1 space-y-1">
                    {image.usedIn.map((usage, idx) => (
                      <Badge key={idx} variant="outline" className="mr-1">
                        {usage}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {image.isManaged && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const dbImage = dbImages?.find(img => img.id === image.dbId);
                      setEditingImage(dbImage);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => image.dbId && deleteMutation.mutate(image.dbId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};