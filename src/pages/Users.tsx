
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Edit, Trash2, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useMembers, useDeleteMember, useMembersPublic, useMember } from '@/hooks/useApi';
import { Member } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Users = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { data: membersResponse, isLoading, error } = useMembersPublic(currentPage);
  const deleteMemberMutation = useDeleteMember();

  // Extract members array from response
  const members = Array.isArray(membersResponse) 
    ? membersResponse 
    : membersResponse?.data?.members || membersResponse?.members || [];

  // Extract pagination info
  const pagination = membersResponse?.data?.pagination || null;

  // Reset search when page changes
  React.useEffect(() => {
    setSearchTerm('');
  }, [currentPage]);

  // Handle error case
  if (error) {
    console.error('Error fetching members:', error);
    // If it's an authorization error, show appropriate message
    const isAuthError = error.message?.includes('401') || error.message?.includes('403');
    
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Anggota</h1>
            <p className="text-gray-600">Lihat data anggota koperasi</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            {isAuthError ? (
              <>
                <p className="text-red-600 mb-4">Anda tidak memiliki akses untuk melihat daftar anggota</p>
                <p className="text-gray-500 mb-4">Fitur ini hanya tersedia untuk administrator</p>
              </>
            ) : (
              <>
                <p className="text-red-600 mb-4">Gagal memuat data member</p>
                <p className="text-gray-500 mb-4">{error.message}</p>
              </>
            )}
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredMembers = members.filter((member: Member) => {
    const matchesSearch = 
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nrp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteMemberMutation.mutateAsync(id);
      setDeleteUserId(null);
      toast({
        title: "Member berhasil dihapus",
        description: "Member telah dihapus dari sistem",
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Gagal menghapus member",
        description: "Terjadi kesalahan saat menghapus member",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data member...</span>
        </div>
      </div>
    );
  }

  const MemberRow = ({ member, currentUser, navigate, formatCurrency, formatDate }) => {
    const { data: detail, isLoading: isDetailLoading } = useMember(member.id);
    const simpanan = detail?.data?.simpanan?.totalSimpanan ?? 0;
    const piutang = detail?.data?.summary?.totalActivePiutangAmount ?? 0;

    return (
      <TableRow key={member.id}>
        <TableCell className="font-medium">{member.nrp}</TableCell>
        <TableCell>{member.nama}</TableCell>
        <TableCell>{member.jabatan}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            member.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {member.role === 'admin' ? 'Admin' : 'Anggota'}
          </span>
        </TableCell>
        <TableCell className="text-green-600 font-medium">
          {isDetailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : formatCurrency(simpanan)}
        </TableCell>
        <TableCell className="text-red-600 font-medium">
          {isDetailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : formatCurrency(piutang)}
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            member.hasActiveLoan 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {member.hasActiveLoan ? `${member.activeLoanCount} pinjaman` : 'Tidak ada'}
          </span>
        </TableCell>
        <TableCell>{formatDate(member.joinDate || member.createdAt)}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/user/${member.id}`)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            {currentUser?.role === 'admin' && member.id !== currentUser.id && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteUserId(member.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Daftar Anggota</h1>
          <p className="text-gray-600">Lihat data anggota koperasi</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button onClick={() => navigate('/register')} className="flex items-center gap-2 w-full md:w-auto">
            <UserPlus className="h-4 w-4" />
            Tambah Member
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NRP</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Simpanan</TableHead>
              <TableHead>Piutang</TableHead>
              <TableHead>Pinjaman Aktif</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <p className="text-gray-500">Tidak ada member yang ditemukan</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member: Member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  currentUser={currentUser}
                  navigate={navigate}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={pagination.currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="flex items-center px-4">
            Halaman {pagination.currentPage} dari {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Member</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteMember(deleteUserId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMemberMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
