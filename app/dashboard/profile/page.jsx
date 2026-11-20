import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata = { title: "Update Profile | FixMate" };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Update Profile</h1>
      <p className="mt-1 mb-6 text-sm text-slate-600">
        Keep your details up to date. Your email and role cannot be changed here.
      </p>
      <ProfileForm />
    </div>
  );
}