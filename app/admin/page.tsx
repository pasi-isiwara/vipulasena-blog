import type { Metadata } from 'next';
import Link from 'next/link';
import { currentAdmin } from '@/lib/auth';
import {
  adminListArticles,
  adminListFolders,
  adminListPhotos,
  listAlbums,
  listQuestions,
  getVisitTotals,
} from '@/lib/queries';
import { AdminApp } from '@/components/admin/AdminApp';
import { SignInForm } from '@/components/admin/SignInForm';

export const metadata: Metadata = {
  title: 'Admin | Vipulasena Pathirajage',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await currentAdmin();

  if (!admin) {
    return (
      <div className="topic-view admin-view">
        <div className="admin-gate">
          <span className="monogram" aria-hidden="true">VP</span>
          <h1>Site admin</h1>
          <p className="admin-gate-msg">
            This area is for the site owner. Please sign in.
          </p>
          <SignInForm />
          <Link className="btn-ghost" href="/">Go to the website</Link>
        </div>
      </div>
    );
  }

  const [articles, folders, albums, photos, questions, totals] = await Promise.all([
    adminListArticles(),
    adminListFolders(),
    listAlbums(),
    adminListPhotos(),
    listQuestions(),
    getVisitTotals(),
  ]);

  return (
    <AdminApp
      admin={admin.name}
      articles={articles}
      folders={folders}
      albums={albums}
      photos={photos}
      questions={questions}
      totals={totals}
    />
  );
}
