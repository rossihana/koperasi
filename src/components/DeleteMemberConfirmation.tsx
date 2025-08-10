
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DeleteMemberConfirmationProps {
  memberId: string;
  memberName: string;
}

export const DeleteMemberConfirmation: React.FC<DeleteMemberConfirmationProps> = ({ memberId, memberName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault(); // Mencegah dialog tertutup otomatis
    setIsDeleting(true);
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN_MEMBER_BY_ID(memberId));
      
      if (response.success) {
        toast({
          title: 'Berhasil',
          description: response.message || `Anggota "${memberName}" berhasil dihapus.`,
        });
        setIsOpen(false); // Tutup dialog setelah berhasil
        navigate('/users');
      } else {
        throw new Error(response.message || 'Gagal menghapus anggota.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus',
        description: error.message || 'Terjadi kesalahan yang tidak diketahui.',
      });
      // Jangan tutup dialog jika gagal, agar pengguna bisa mencoba lagi atau membatalkan
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus Anggota
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda yakin ingin menghapus anggota ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat diurungkan. Anggota "{memberName}" akan dihapus secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDelete(e)} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
